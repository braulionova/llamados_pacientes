/**
 * ARQUITECTURA DEL SISTEMA
 * 
 * ┌─────────────────────────────────────────────────────────────────┐
 * │                      CLIENTE (NAVEGADOR)                        │
 * │  index.html + JavaScript Client                                 │
 * │  - Interfaz responsiva                                          │
 * │  - Conexión WebSocket automática                               │
 * │  - Llamadas REST API                                           │
 * └────────────────┬────────────────────────────────────────────────┘
 *                  │
 *    ┌─────────────┴──────────────┐
 *    │                            │
 * REST                         WebSocket
 *    │                            │
 * ┌──┴────────────────────────────┴──┐
 * │                                   │
 * │   EXPRESS SERVER (Node.js)        │
 * │   ├── REST Endpoints              │
 * │   │   ├── /api/health            │
 * │   │   ├── /api/llamados          │
 * │   │   ├── /api/llamados/pendientes
 * │   │   ├── /api/llamados/crear    │
 * │   │   └── /api/llamados/:id/reproducido
 * │   │                              │
 * │   └── WebSocket Server           │
 * │       ├── ConnectionManager      │
 * │       ├── Broadcasting           │
 * │       └── Real-time Events      │
 * │                                   │
 * └────────────┬─────────────────────┘
 *              │
 *        SUPABASE CLIENT
 *              │
 * ┌────────────┴──────────────────┐
 * │                               │
 * │  SUPABASE DATABASE            │
 * │  ├── Tabla: llamados          │
 * │  │   ├── id                   │
 * │  │   ├── turno_numero         │
 * │  │   ├── paciente_nombre      │
 * │  │   ├── consultorio          │
 * │  │   ├── texto_completo       │
 * │  │   ├── reproducido          │
 * │  │   └── created_at           │
 * │  │                             │
 * │  └── Authentication (RLS)     │
 * │                               │
 * └───────────────────────────────┘
 * 
 * 
 * FLUJO DE DATOS
 * ==============
 * 
 * 1. CREAR LLAMADO
 *    Cliente → POST /api/llamados/crear
 *           → Express server validates & inserts
 *           → Supabase stores in DB
 *           → Broadcasting nuevo_llamado
 *           → All connected clients receive via WebSocket
 * 
 * 2. OBTENER PENDIENTES
 *    Cliente → GET /api/llamados/pendientes
 *           → Express queries Supabase
 *           → Returns first non-reproduced call
 *           → Client displays
 * 
 * 3. MARCAR REPRODUCIDO
 *    Cliente → POST /api/llamados/:id/reproducido
 *           → Express updates Supabase
 *           → Broadcasting llamado_reproducido
 *           → All clients notified of change
 * 
 * 4. TIEMPO REAL (WebSocket)
 *    Client → Opens WebSocket connection
 *          → Joins ConnectionManager pool
 *          → Server broadcasts events:
 *             - nuevo_llamado
 *             - llamado_reproducido
 *             - llamado_reproduciendo
 *          → Auto-reconnect if disconnected
 * 
 * 
 * COMPONENTES CLAVE
 * =================
 * 
 * ConnectionManager
 * ├── Mantiene pool de conexiones WebSocket activas
 * ├── Broadcast eficiente de mensajes
 * └── Manejo de desconexiones
 * 
 * LlamadosClient
 * ├── Cliente WebSocket reutilizable
 * ├── Event emitter pattern
 * ├── Reconexión automática con backoff
 * └── Funciona en navegador y Node.js
 * 
 * Server
 * ├── Express.js para REST
 * ├── ws para WebSocket
 * ├── CORS habilitado
 * └── Supabase integration
 * 
 * 
 * EJEMPLOS DE EVENTOS WebSocket
 * ============================
 * 
 * Ping/Pong (Keep-alive)
 * {
 *   "type": "ping"
 * }
 * 
 * Nuevo Llamado (Broadcast)
 * {
 *   "type": "nuevo_llamado",
 *   "data": {
 *     "id": 1,
 *     "turno_numero": 15,
 *     "paciente_nombre": "Juan Pérez",
 *     "consultorio": 3,
 *     "texto_completo": "Turno número 15, Juan Pérez...",
 *     "reproducido": false,
 *     "created_at": "2026-01-23T..."
 *   },
 *   "timestamp": "2026-01-23T..."
 * }
 * 
 * Llamado Reproducido (Broadcast)
 * {
 *   "type": "llamado_reproducido",
 *   "id": 1,
 *   "timestamp": "2026-01-23T..."
 * }
 * 
 * 
 * GESTIÓN DE ERRORES
 * ==================
 * 
 * 1. Conexión WebSocket perdida
 *    → Cliente intenta reconectar automáticamente
 *    → Backoff exponencial (3 segundos)
 *    → Evento 'disconnected' emitido
 * 
 * 2. Error en Supabase
 *    → Respuesta HTTP 500
 *    → Mensaje de error detallado
 *    → Log en servidor
 * 
 * 3. Cliente desconecta inesperadamente
 *    → Server limpia conexión
 *    → Recurso liberado en ConnectionManager
 *    → Otros clientes no afectados
 * 
 * 
 * ESCALABILIDAD
 * =============
 * 
 * Actual (Un servidor):
 * - Unlimited WebSocket connections (limitado por recursos)
 * - Broadcasting O(n) donde n = clientes conectados
 * - Suficiente para consultorio pequeño/mediano
 * 
 * Para escalar:
 * - Redis para pub/sub entre múltiples servidores
 * - Load balancer con sticky sessions
 * - Supabase realtime API como alternativa a WebSocket
 * 
 * 
 * DEPLOYMENT
 * ==========
 * 
 * Local:
 *   npm start
 * 
 * Docker:
 *   docker build -t llamados .
 *   docker run -p 8000:8000 llamados
 * 
 * Heroku:
 *   git push heroku main
 * 
 * Railway/Render:
 *   Conectar repo y deploy automático
 */

// ESTE ARCHIVO ES SOLO DOCUMENTACIÓN
// La arquitectura está implementada en server.js
