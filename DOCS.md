# 🏥 Sistema de Llamado en Tiempo Real - Documentación Completa

## 📋 Tabla de Contenidos
1. [Inicio Rápido](#inicio-rápido)
2. [Instalación Detallada](#instalación-detallada)
3. [Configuración](#configuración)
4. [Uso del Sistema](#uso-del-sistema)
5. [API REST](#api-rest)
6. [WebSocket API](#websocket-api)
7. [Ejemplos Prácticos](#ejemplos-prácticos)
8. [Deployment](#deployment)
9. [Troubleshooting](#troubleshooting)

---

## 🚀 Inicio Rápido

### Para usuarios impacientes (3 minutos)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (.env ya está con credenciales)
# Ver archivo .env

# 3. Ejecutar servidor
npm start

# 4. Abrir navegador
# http://localhost:8000/index.html

# 5. ¡Listo! Crear llamados y ver en tiempo real
```

---

## 📦 Instalación Detallada

### Requisitos Previos
- **Node.js**: v14 o superior ([descargar](https://nodejs.org/))
- **npm**: incluido con Node.js
- **Cuenta Supabase**: con tabla `llamados` creada

### Paso 1: Clonar/Descargar el Proyecto
```bash
# Si tienes Git
git clone <repository-url>
cd llamar_paciente_dra_reyes_v3

# O simplemente descargar y extraer la carpeta
```

### Paso 2: Instalar Dependencias
```bash
npm install
```

Esto instalará:
- `express` - Servidor HTTP
- `ws` - WebSocket nativo
- `@supabase/supabase-js` - Cliente Supabase
- `cors` - Middleware CORS
- `dotenv` - Manejo de variables de entorno

### Paso 3: Verificar Instalación
```bash
npm list

# Output esperado:
# sistema-llamados@1.0.0
# ├── @supabase/supabase-js@2.38.4
# ├── cors@2.8.5
# ├── dotenv@16.3.1
# ├── express@4.18.2
# └── ws@8.14.2
```

---

## ⚙️ Configuración

### Archivo `.env`
Ya está configurado con tus credenciales. Si necesitas cambiarlas:

```env
# Supabase
SUPABASE_URL=https://jyltuehmusxsmkoamyhu.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Servidor
PORT=8000
NODE_ENV=development
```

### Tabla en Supabase
Debe tener esta estructura:

```sql
CREATE TABLE llamados (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  turno_numero INT NOT NULL,
  paciente_nombre VARCHAR NOT NULL,
  consultorio INT NOT NULL,
  texto_completo VARCHAR NOT NULL,
  reproducido BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_reproducido ON llamados(reproducido);
CREATE INDEX idx_created_at ON llamados(created_at DESC);
```

---

## 🎯 Uso del Sistema

### Opción 1: Interfaz Web (Recomendado)

1. **Iniciar servidor**:
   ```bash
   npm start
   ```

2. **Abrir en navegador**:
   ```
   http://localhost:8000/index.html
   ```

3. **Crear llamado**:
   - Llenar número de turno
   - Ingresar nombre del paciente
   - Seleccionar consultorio
   - Hacer clic en "Crear Llamado"

4. **Monitorear eventos**:
   - Ver eventos en tiempo real en el panel
   - Verificar log de sistema
   - Obtener últimos llamados

### Opción 2: Cliente Node.js

```bash
# Terminal 1: Iniciar servidor
npm start

# Terminal 2: Ejecutar cliente
node example-client.js
```

### Opción 3: REST API con curl

```bash
# Health check
curl http://localhost:8000/api/health

# Crear llamado
curl -X POST http://localhost:8000/api/llamados/crear \
  -H "Content-Type: application/json" \
  -d '{
    "turno_numero": 15,
    "paciente_nombre": "Juan Pérez",
    "consultorio": 3
  }'

# Obtener pendientes
curl http://localhost:8000/api/llamados/pendientes

# Marcar como reproducido
curl -X POST http://localhost:8000/api/llamados/1/reproducido
```

---

## 📡 API REST

### 1. Health Check
```
GET /api/health
```

**Respuesta**:
```json
{
  "status": "ok",
  "timestamp": "2026-01-23T10:30:00.000Z"
}
```

**Uso**: Verificar que el servidor está funcionando

---

### 2. Obtener Últimos Llamados
```
GET /api/llamados?limit=10
```

**Parámetros**:
- `limit` (opcional): número de registros (default: 10)

**Respuesta**:
```json
{
  "data": [
    {
      "id": 1,
      "turno_numero": 15,
      "paciente_nombre": "Juan Pérez",
      "consultorio": 3,
      "texto_completo": "Turno número 15, Juan Pérez, favor pasar al consultorio 3",
      "reproducido": true,
      "created_at": "2026-01-23T10:25:00.000Z"
    },
    ...
  ],
  "status": "success"
}
```

---

### 3. Obtener Primer Pendiente
```
GET /api/llamados/pendientes
```

**Respuesta** (hay pendiente):
```json
{
  "data": {
    "id": 2,
    "turno_numero": 16,
    "paciente_nombre": "María García",
    "consultorio": 2,
    "texto_completo": "Turno número 16, María García, favor pasar al consultorio 2",
    "reproducido": false,
    "created_at": "2026-01-23T10:30:00.000Z"
  },
  "status": "success"
}
```

**Respuesta** (sin pendientes):
```json
{
  "data": null,
  "status": "success"
}
```

---

### 4. Crear Nuevo Llamado
```
POST /api/llamados/crear
Content-Type: application/json
```

**Body**:
```json
{
  "turno_numero": 15,
  "paciente_nombre": "Juan Pérez",
  "consultorio": 3
}
```

**Respuesta**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "turno_numero": 15,
      "paciente_nombre": "Juan Pérez",
      "consultorio": 3,
      "texto_completo": "Turno número 15, Juan Pérez, favor pasar al consultorio 3",
      "reproducido": false,
      "created_at": "2026-01-23T10:30:00.000Z"
    }
  ]
}
```

**Nota**: Este endpoint también emite un evento WebSocket `nuevo_llamado` a todos los clientes conectados.

---

### 5. Marcar como Reproducido
```
POST /api/llamados/:id/reproducido
```

**Parámetros**:
- `id` (requerido): ID del llamado

**Ejemplo**:
```
POST /api/llamados/1/reproducido
```

**Respuesta**:
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "reproducido": true
    }
  ]
}
```

**Nota**: Este endpoint emite un evento WebSocket `llamado_reproducido` a todos los clientes.

---

## 🔌 WebSocket API

### Conexión

**JavaScript (Navegador)**:
```javascript
const client = new LlamadosClient('ws://localhost:8000');
await client.connect();
```

**Node.js**:
```javascript
import LlamadosClient from './client.js';
const client = new LlamadosClient('ws://localhost:8000');
await client.connect();
```

### Eventos

#### 1. Conectado
```javascript
client.on('connected', () => {
  console.log('Conectado!');
});
```

#### 2. Nuevo Llamado (Recibido)
```javascript
client.on('nuevo_llamado', (message) => {
  console.log('Turno:', message.data.turno_numero);
  console.log('Paciente:', message.data.paciente_nombre);
  console.log('Consultorio:', message.data.consultorio);
});
```

#### 3. Llamado Reproducido (Recibido)
```javascript
client.on('llamado_reproducido', (message) => {
  console.log('Llamado reproducido:', message.id);
});
```

#### 4. Reproduciendo (Recibido)
```javascript
client.on('llamado_reproduciendo', (message) => {
  console.log('Se está reproduciendo:', message.id);
});
```

#### 5. Pong (Keep-alive)
```javascript
client.on('pong', (message) => {
  console.log('Servidor respondió');
});
```

#### 6. Desconectado
```javascript
client.on('disconnected', () => {
  console.log('Desconectado (intentando reconectar)');
});
```

### Métodos del Cliente

```javascript
// Conectar
await client.connect();

// Enviar ping (keep-alive)
client.ping();

// Reportar reproducción
client.reportarReproduccion(llamado_id);

// Enviar mensaje personalizado
client.send({
  type: 'custom',
  data: 'tu data aquí'
});

// Desconectar
client.disconnect();

// Escuchar eventos
client.on('evento', (data) => {
  // handle
});
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Sistema Monitor Consultorio

```javascript
import LlamadosClient from './client.js';

const client = new LlamadosClient();

client.on('nuevo_llamado', async (message) => {
  const { data } = message;
  
  // Reproducir audio
  const utterance = new SpeechSynthesisUtterance(data.texto_completo);
  utterance.lang = 'es-ES';
  speechSynthesis.speak(utterance);
  
  // Mostrar notificación
  new Notification('Nuevo Llamado', {
    body: `${data.paciente_nombre} - Consultorio ${data.consultorio}`,
    icon: '📞'
  });
});

await client.connect();
```

### Ejemplo 2: Dashboard Administrador

```javascript
// Ver todos los eventos en tiempo real
const client = new LlamadosClient();

client.on('nuevo_llamado', (msg) => {
  updateDashboard('nuevo', msg.data);
});

client.on('llamado_reproducido', (msg) => {
  updateDashboard('completado', msg.id);
});

function updateDashboard(tipo, data) {
  const evento = {
    tipo,
    timestamp: new Date(),
    data
  };
  
  // Guardar en analytics
  logEvent(evento);
  
  // Actualizar UI
  refreshDashboard();
}

await client.connect();
```

### Ejemplo 3: Integración con Sistema Externo

```javascript
// Crear llamado desde sistema de agenda
async function crearLlamadoDesdeAgenda(cita) {
  const response = await fetch('http://localhost:8000/api/llamados/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      turno_numero: cita.numero_turno,
      paciente_nombre: cita.paciente.nombre,
      consultorio: cita.consultorio.numero
    })
  });
  
  const result = await response.json();
  return result.status === 'success';
}

// Marcar reproducido cuando paciente ingresa
function onPacienteIngresa(llamado_id) {
  fetch(`http://localhost:8000/api/llamados/${llamado_id}/reproducido`, {
    method: 'POST'
  });
}
```

---

## 🚀 Deployment

### Opción 1: Heroku

1. **Inicializar Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Crear app en Heroku**:
   ```bash
   heroku create mi-sistema-llamados
   ```

3. **Configurar variables de entorno**:
   ```bash
   heroku config:set SUPABASE_URL=https://...
   heroku config:set SUPABASE_KEY=...
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

5. **Acceder**:
   ```
   https://mi-sistema-llamados.herokuapp.com/index.html
   ```

### Opción 2: Docker

1. **Build**:
   ```bash
   docker build -t llamados-app .
   ```

2. **Run**:
   ```bash
   docker run -p 8000:8000 \
     -e SUPABASE_URL=https://... \
     -e SUPABASE_KEY=... \
     llamados-app
   ```

### Opción 3: Docker Compose

```bash
docker-compose up -d
```

### Opción 4: Railway o Render

1. Conectar repositorio Git
2. Configurar variables de entorno en dashboard
3. Deploy automático

---

## 🐛 Troubleshooting

### Problema: "Error de conexión a Supabase"

**Síntomas**: Error 403 o 401

**Solución**:
1. Verificar URL en `.env`
2. Verificar API key en `.env`
3. Verificar que la tabla `llamados` existe
4. Verificar policies de RLS en Supabase

```bash
# Test conexión
curl -X GET "https://jyltuehmusxsmkoamyhu.supabase.co/rest/v1/llamados?limit=1" \
  -H "apikey: tu-key-aqui"
```

---

### Problema: "WebSocket no conecta"

**Síntomas**: Cliente intenta conectar pero no puede

**Solución**:
1. Verificar que servidor está corriendo:
   ```bash
   curl http://localhost:8000/api/health
   ```

2. Verificar firewall/puertos:
   ```bash
   netstat -an | grep 8000
   ```

3. Revisar consola del navegador (F12 → Console)

4. Verificar que la URL es correcta: `ws://localhost:8000`

---

### Problema: "Memoria llena" o "Conexiones se cierran"

**Síntomas**: Servidor se ralentiza o desconecta usuarios

**Solución**:
1. Verificar número de conexiones:
   ```bash
   # En el log del servidor
   # "Total: X"
   ```

2. Aumentar límites del servidor:
   ```bash
   # En server.js
   const wss = new WebSocketServer({ 
     server,
     maxPayload: 100 * 1024 * 1024 // 100MB
   });
   ```

3. Para escalar, usar Redis:
   ```bash
   npm install redis
   # Implementar pub/sub
   ```

---

### Problema: "Llamados no aparecen"

**Síntomas**: POST crear llamado funciona pero no aparecen en la interfaz

**Solución**:
1. Verificar que tabla existe en Supabase
2. Verificar policies de RLS permiten SELECT
3. Revisar log del servidor:
   ```bash
   # Buscar errores
   npm run dev  # Ver en consola
   ```

4. Test directo REST API:
   ```bash
   curl http://localhost:8000/api/llamados
   ```

---

### Problema: "Puerto 8000 en uso"

**Síntomas**: "Error: listen EADDRINUSE :::8000"

**Solución**:

Windows:
```powershell
# Encontrar proceso
netstat -ano | findstr :8000

# Matar proceso (reemplazar PID)
taskkill /PID <PID> /F
```

Linux/Mac:
```bash
# Encontrar y matar
lsof -i :8000
kill -9 <PID>

# O cambiar puerto en .env
PORT=3000
```

---

## 📞 Contacto & Soporte

- **Documentación**: Ver README.md
- **Arquitectura**: Ver ARCHITECTURE.md
- **Ejemplos**: Ver example-*.js

---

## ✅ Checklist de Deployment

- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Tabla Supabase creada y verificada
- [ ] Servidor inicia sin errores (`npm start`)
- [ ] API REST responde (`curl http://localhost:8000/api/health`)
- [ ] WebSocket conecta (abrir index.html)
- [ ] Crear llamado funciona
- [ ] Eventos en tiempo real funcionan
- [ ] Se puede marcar como reproducido
- [ ] Múltiples navegadores/clientes se conectan
- [ ] Reconexión automática funciona

---

**🎉 ¡Sistema listo para usar!**
