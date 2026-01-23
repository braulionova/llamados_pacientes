import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// ========================================
// CONFIGURACIÓN
// ========================================
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const PORT = process.env.PORT || 8000;

// ========================================
// INICIALIZACIÓN
// ========================================
const app = express();

// Configurar CORS para Vercel
app.use(cors({ 
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['X-Requested-With', 'Content-Type', 'Accept', 'Origin']
}));
app.use(express.json());

// Servir archivos estáticos
app.use(express.static('.'));

// Cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Para Vercel, necesitamos manejar WebSocket de manera diferente
let wss;

// ========================================
// CONNECTION MANAGER (Equivalente a FastAPI)
// ========================================
class ConnectionManager {
  constructor() {
    this.activeConnections = new Set();
    this.maxConnections = 1; // Solo 1 conexión activa para llamados de pacientes
  }

  connect(ws) {
    // Limpiar conexiones muertas primero
    this.cleanupDeadConnections();
    
    // Si ya hay una conexión activa, cerrar la más antigua
    if (this.activeConnections.size >= this.maxConnections) {
      const oldestConnection = this.activeConnections.values().next().value;
      if (oldestConnection && oldestConnection !== ws) {
        console.log('🔴 Cerrando conexión existente para permitir nueva conexión');
        oldestConnection.terminate();
        this.activeConnections.delete(oldestConnection);
      }
    }
    
    this.activeConnections.add(ws);
    console.log(`✅ Cliente conectado. Total: ${this.activeConnections.size}/${this.maxConnections}`);
  }

  disconnect(ws) {
    this.activeConnections.delete(ws);
    console.log(`❌ Cliente desconectado. Total: ${this.activeConnections.size}/${this.maxConnections}`);
  }

  cleanupDeadConnections() {
    let cleaned = 0;
    for (const connection of this.activeConnections) {
      if (connection.readyState !== 1) { // 1 = OPEN
        this.activeConnections.delete(connection);
        cleaned++;
      }
    }
    if (cleaned > 0) {
      console.log(`🧹 Limpiadas ${cleaned} conexiones muertas`);
    }
  }

  async broadcast(message) {
    this.cleanupDeadConnections();
    const messageStr = JSON.stringify(message);
    
    for (const connection of this.activeConnections) {
      try {
        if (connection.readyState === 1) { // 1 = OPEN
          connection.send(messageStr);
        }
      } catch (error) {
        console.error('Error enviando mensaje:', error);
        this.activeConnections.delete(connection);
      }
    }
  }

  // Método para forzar una sola conexión activa
  enforceSingleConnection() {
    if (this.activeConnections.size > 1) {
      const connections = Array.from(this.activeConnections);
      // Mantener solo la última conexión
      for (let i = 0; i < connections.length - 1; i++) {
        connections[i].terminate();
        this.activeConnections.delete(connections[i]);
      }
      console.log(`🔴 Forzado modo de conexión única: ${this.activeConnections.size} conexión(es) activa(s)`);
    }
  }
}

const manager = new ConnectionManager();

// ========================================
// ENDPOINTS REST
// ========================================

// Redirigir raíz a index.html
app.get('/', (req, res) => {
  res.redirect('/index.html');
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Obtener últimos llamados
app.get('/api/llamados', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const { data, error } = await supabase
      .from('llamados')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    res.json({
      data,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 'error'
    });
  }
});

// Obtener primer llamado no reproducido (pendientes)
app.get('/api/llamados/pendientes', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('llamados')
      .select('*')
      .eq('reproducido', false)
      .order('created_at', { ascending: true })
      .limit(1);

    if (error) throw error;

    res.json({
      data: data.length > 0 ? data[0] : null,
      status: 'success'
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 'error'
    });
  }
});

// Marcar como reproducido
app.post('/api/llamados/:id/reproducido', async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('llamados')
      .update({ reproducido: true })
      .eq('id', id)
      .select();

    if (error) throw error;

    // Notificar a todos los clientes conectados
    await manager.broadcast({
      type: 'llamado_reproducido',
      id: parseInt(id),
      timestamp: new Date().toISOString()
    });

    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 'error'
    });
  }
});

// Endpoint para obtener estado de conexiones
app.get('/api/conexiones', (req, res) => {
  res.json({
    status: 'ok',
    conexiones_activas: manager.activeConnections.size,
    max_conexiones: manager.maxConnections,
    websocket_clientes: wss ? wss.clients.size : 0,
    timestamp: new Date().toISOString()
  });
});

// Endpoint para limpiar conexiones muertas
app.post('/api/limpiar-conexiones', (req, res) => {
  let terminadas = 0;
  if (wss) {
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        terminadas++;
        ws.terminate();
      }
    });
  }
  
  res.json({
    status: 'ok',
    conexiones_terminadas: terminadas,
    conexiones_activas: manager.activeConnections.size,
    timestamp: new Date().toISOString()
  });
});

// Endpoint para resetear todas las conexiones (fuerza cierre de todas)
app.post('/api/reset-conexiones', (req, res) => {
  let terminadas = 0;
  if (wss) {
    wss.clients.forEach((ws) => {
      terminadas++;
      ws.terminate();
    });
  }
  
  // Resetear el manager
  manager.activeConnections.clear();
  
  console.log(`🔄 Reset de conexiones: ${terminadas} terminadas`);
  console.log(`🔌 Modo de conexión única activado - Máximo: ${manager.maxConnections}`);
  
  res.json({
    status: 'ok',
    conexiones_resetadas: terminadas,
    conexiones_activas_ahora: manager.activeConnections.size,
    max_conexiones: manager.maxConnections,
    timestamp: new Date().toISOString()
  });
});

// Crear nuevo llamado
app.post('/api/llamados/crear', async (req, res) => {
  try {
    const { turno_numero, paciente_nombre, consultorio } = req.body;

    const texto_completo = `Turno número ${turno_numero}, ${paciente_nombre}, favor pasar al consultorio ${consultorio}`;

    const { data, error } = await supabase
      .from('llamados')
      .insert({
        turno_numero,
        paciente_nombre,
        consultorio,
        texto_completo,
        reproducido: false
      })
      .select();

    if (error) throw error;

    // Notificar a todos los clientes
    if (data && data.length > 0) {
      await manager.broadcast({
        type: 'nuevo_llamado',
        data: data[0],
        timestamp: new Date().toISOString()
      });
    }

    res.json({
      status: 'success',
      data
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      status: 'error'
    });
  }
});

// ========================================
// MONITOR DE SUPABASE EN TIEMPO REAL
// ========================================
let ultimoIdMonitoreado = 0;

async function iniciarMonitorSupabase() {
  console.log('\n📊 Iniciando monitor de Supabase...');

  try {
    // Obtener último ID
    const { data: ultimoCalls } = await supabase
      .from('llamados')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    ultimoIdMonitoreado = ultimoCalls?.[0]?.id || 0;
    console.log(`✅ Monitor listo. Último ID: ${ultimoIdMonitoreado}`);

    // Polling cada 1 segundo para detectar nuevos registros
    setInterval(async () => {
      try {
        const { data: nuevosCalls, error } = await supabase
          .from('llamados')
          .select('*')
          .gt('id', ultimoIdMonitoreado)
          .order('id', { ascending: true });

        if (error) {
          console.error('Error en monitor:', error.message);
          return;
        }

        if (nuevosCalls && nuevosCalls.length > 0) {
          nuevosCalls.forEach((llamado) => {
            if (llamado.id > ultimoIdMonitoreado) {
              ultimoIdMonitoreado = llamado.id;

              console.log('\n📣 ¡NUEVO LLAMADO DETECTADO EN SUPABASE!');
              console.log(`   ID: ${llamado.id}`);
              console.log(`   Turno: ${llamado.turno_numero}`);
              console.log(`   Paciente: ${llamado.paciente_nombre}`);
              console.log(`   Consultorio: ${llamado.consultorio}`);
              console.log(`   Hora: ${new Date(llamado.created_at).toLocaleTimeString()}\n`);

              // Broadcast a todos los clientes WebSocket
              manager.broadcast({
                type: 'nuevo_llamado',
                data: llamado,
                timestamp: new Date().toISOString()
              });
            }
          });
        }
      } catch (error) {
        console.error('Error en polling:', error.message);
      }
    }, 1000); // Monitorear cada segundo

  } catch (error) {
    console.error('Error inicializando monitor:', error);
  }
}

// ========================================
// INICIALIZACIÓN PARA VERCEL
// ========================================

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  const { createServer } = await import('http');
  const server = createServer(app);
  wss = new WebSocketServer({ server });

  // Configurar WebSocket handlers
  wss.on('connection', (ws) => {
    manager.connect(ws);
    
    // Forzar modo de conexión única
    manager.enforceSingleConnection();
    
    // Marcar como vivo
    ws.isAlive = true;
    
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data);

        if (message.type === 'ping') {
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
        } else if (message.type === 'reproducir') {
          // Cliente reporta que está reproduciendo un llamado
          await manager.broadcast({
            type: 'llamado_reproduciendo',
            id: message.id,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error procesando mensaje WebSocket:', error);
      }
    });

    ws.on('close', () => {
      manager.disconnect(ws);
    });

    ws.on('error', (error) => {
      console.error('Error WebSocket:', error);
      manager.disconnect(ws);
    });
  });

  // Heartbeat para limpiar conexiones muertas y forzar conexión única
  setInterval(() => {
    let conexionesVivas = 0;
    let conexionesTerminadas = 0;
    
    wss.clients.forEach((ws) => {
      if (ws.isAlive === false) {
        conexionesTerminadas++;
        ws.terminate();
      } else {
        conexionesVivas++;
        ws.isAlive = false;
        ws.ping();
      }
    });
    
    // Forzar modo de conexión única
    manager.enforceSingleConnection();
    
    if (conexionesTerminadas > 0) {
      console.log(`🧹 Limpieza de conexiones: ${conexionesTerminadas} terminadas, ${conexionesVivas} vivas`);
    }
  }, 15000); // Cada 15 segundos (más frecuente para mejor control)

  server.listen(PORT, () => {
    console.log('🚀 Sistema de Llamados iniciado');
    console.log(`📡 Servidor escuchando en puerto ${PORT}`);
    console.log(`🌐 WebSocket: ws://localhost:${PORT}`);
    console.log(`🏥 Consultorio: Dra. Reyes`);
    
    // Iniciar monitor de Supabase
    iniciarMonitorSupabase();
  });
} else {
  // Para producción en Vercel (sin WebSocket)
  console.log('🚀 Iniciando en modo Vercel (sin WebSocket)');
  iniciarMonitorSupabase();
}

// Export para Vercel
export default app;