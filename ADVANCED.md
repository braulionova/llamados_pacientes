/**
 * CONFIGURACIONES AVANZADAS
 * Opciones para optimizar el sistema
 */

// ========================================
// 1. OPTIMIZACIÓN DE RENDIMIENTO
// ========================================

// En server.js, después de crear wss:

// Aumentar límite de payload
const wss = new WebSocketServer({ 
  server,
  maxPayload: 100 * 1024 * 1024, // 100MB
  perMessageDeflate: {
    zlevel: 3, // Compresión DEFLATE
    clientNoContextTakeover: true,
    serverNoContextTakeover: true,
  }
});

// Límite de conexiones simultáneas
const MAX_CONNECTIONS = 1000;

class ConnectionManager {
  constructor(maxConnections = MAX_CONNECTIONS) {
    this.activeConnections = new Set();
    this.maxConnections = maxConnections;
  }

  async connect(ws) {
    if (this.activeConnections.size >= this.maxConnections) {
      ws.close(1008, 'Server at capacity');
      return;
    }
    this.activeConnections.add(ws);
    console.log(`✅ Cliente conectado. Total: ${this.activeConnections.size}`);
  }

  // ... resto igual
}

// ========================================
// 2. AUTENTICACIÓN Y SEGURIDAD
// ========================================

// Middleware de autenticación
import jwt from 'jsonwebtoken';

const AUTH_SECRET = process.env.AUTH_SECRET || 'your-secret-key';

function verifyToken(token) {
  try {
    return jwt.verify(token, AUTH_SECRET);
  } catch (error) {
    return null;
  }
}

// Proteger endpoints
app.post('/api/llamados/crear', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const user = verifyToken(token);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Continuar con lógica...
});

// ========================================
// 3. RATE LIMITING
// ========================================

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Aplicar a endpoints críticos
app.post('/api/llamados/crear', limiter, async (req, res) => {
  // ...
});

// ========================================
// 4. LOGGING Y MONITOREO
// ========================================

import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Usar en código
logger.info(`Nuevo llamado: ${paciente_nombre}`);
logger.error(`Error Supabase: ${error.message}`);

// ========================================
// 5. CACHÉ CON REDIS
// ========================================

import redis from 'redis';

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379
});

async function getLlamados(limit = 10) {
  // Intentar obtener del caché
  const cached = await redisClient.get(`llamados:${limit}`);
  if (cached) return JSON.parse(cached);
  
  // Obtener de Supabase
  const { data } = await supabase
    .from('llamados')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  // Guardar en caché por 5 minutos
  await redisClient.setex(`llamados:${limit}`, 300, JSON.stringify(data));
  
  return data;
}

// Invalidar caché al crear
app.post('/api/llamados/crear', async (req, res) => {
  // ...crear...
  
  // Invalidar caché
  await redisClient.del('llamados:*');
  
  // ...
});

// ========================================
// 6. MÉTRICAS Y ANALYTICS
// ========================================

class Metrics {
  constructor() {
    this.startTime = Date.now();
    this.eventos = {
      llamados_creados: 0,
      llamados_reproducidos: 0,
      conexiones_activas: 0,
      desconexiones: 0
    };
  }

  recordLlamado() {
    this.eventos.llamados_creados++;
  }

  recordReproduccion() {
    this.eventos.llamados_reproducidos++;
  }

  getStats() {
    return {
      uptime: Date.now() - this.startTime,
      ...this.eventos
    };
  }
}

const metrics = new Metrics();

// Endpoint de métricas
app.get('/api/metrics', (req, res) => {
  res.json(metrics.getStats());
});

// ========================================
// 7. BACKUP AUTOMÁTICO
// ========================================

import fs from 'fs';
import path from 'path';

async function backupLlamados() {
  const { data } = await supabase.from('llamados').select('*');
  
  const filename = `backup-${new Date().toISOString()}.json`;
  const filepath = path.join('./backups', filename);
  
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`✅ Backup guardado: ${filename}`);
}

// Ejecutar cada 24 horas
setInterval(backupLlamados, 24 * 60 * 60 * 1000);

// ========================================
// 8. NOTIFICACIONES POR EMAIL
// ========================================

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function notificarNuevoLlamado(llamado) {
  await transporter.sendMail({
    from: 'consultorio@example.com',
    to: 'doctor@example.com',
    subject: `Nuevo Llamado - ${llamado.paciente_nombre}`,
    html: `
      <h2>Nuevo Llamado</h2>
      <p><strong>Turno:</strong> ${llamado.turno_numero}</p>
      <p><strong>Paciente:</strong> ${llamado.paciente_nombre}</p>
      <p><strong>Consultorio:</strong> ${llamado.consultorio}</p>
      <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
    `
  });
}

// ========================================
// 9. WEBHOOK INTEGRACIÓN EXTERNA
// ========================================

async function triggerWebhook(event, data) {
  const webhookUrl = process.env.WEBHOOK_URL;
  
  if (!webhookUrl) return;
  
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event,
        data,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error al disparar webhook:', error);
  }
}

// Usar al crear llamado
await triggerWebhook('nuevo_llamado', llamado);

// ========================================
// 10. MULTIPLES CONSULTORIOS
// ========================================

// Agregar campo 'consultorio_id' a la tabla

app.ws('/ws/:consultorio_id', async (ws, req) => {
  const consultorioId = req.params.consultorio_id;
  
  manager.connect(ws, consultorioId);
  
  ws.on('message', async (data) => {
    const message = JSON.parse(data);
    
    // Solo notificar al consultorio correspondiente
    await manager.broadcastToConsultorio(consultorioId, {
      type: message.type,
      data: message.data
    });
  });
});

// ========================================
// 11. PRUEBAS DE CARGA
// ========================================

// Instalar: npm install artillery

// artillery.yml
/*
config:
  target: "http://localhost:8000"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Ramping up"

scenarios:
  - name: "Crear Llamados"
    flow:
      - post:
          url: "/api/llamados/crear"
          json:
            turno_numero: "{{ $randomNumber(1, 999) }}"
            paciente_nombre: "Paciente {{ $randomNumber(1, 999) }}"
            consultorio: "{{ $randomNumber(1, 5) }}"
*/

// Ejecutar: artillery run artillery.yml

// ========================================
// 12. CONFIGURACIÓN DE PRODUCCIÓN
// ========================================

const config = {
  development: {
    supabase: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    },
    server: {
      port: 8000,
      host: 'localhost'
    },
    logging: 'debug'
  },
  production: {
    supabase: {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_KEY
    },
    server: {
      port: process.env.PORT || 3000,
      host: '0.0.0.0'
    },
    logging: 'error',
    ssl: {
      cert: process.env.SSL_CERT,
      key: process.env.SSL_KEY
    }
  }
};

const currentConfig = config[process.env.NODE_ENV || 'development'];

// ========================================
// NOTA
// ========================================

/*
Para usar estas configuraciones avanzadas:

1. Instalar paquetes necesarios:
   npm install jwt winston redis nodemailer express-rate-limit artillery

2. Configurar variables de entorno adicionales:
   REDIS_HOST=localhost
   REDIS_PORT=6379
   EMAIL_USER=email@gmail.com
   EMAIL_PASS=app-password
   AUTH_SECRET=tu-secret-key
   WEBHOOK_URL=https://...

3. Integrar en server.js según necesidad

4. Ajustar según arquitectura deseada
*/
