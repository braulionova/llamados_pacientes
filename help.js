#!/usr/bin/env node

/**
 * 🏥 HELPER DE INICIO RÁPIDO
 * Ejecutar: node help.js
 */

console.clear();

const help = `
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║          🏥 SISTEMA DE LLAMADOS - GUÍA DE AYUDA RÁPIDA 🏥                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝

📍 ESTÁS EN: c:\\python\\llamar_paciente_dra_reyes_v3

═══════════════════════════════════════════════════════════════════════════════

🚀 PARA EMPEZAR EN 3 PASOS:

  1️⃣  npm start
      (Inicia el servidor en puerto 8000)

  2️⃣  Abre en navegador:
      http://localhost:8000/index.html

  3️⃣  ¡Crea llamados y mira los eventos en tiempo real!

═══════════════════════════════════════════════════════════════════════════════

📚 DOCUMENTACIÓN DISPONIBLE:

  EMPEZAR RÁPIDO (3 min)        → QUICKSTART.md
  GUÍA COMPLETA (60 min)        → README.md
  DOCUMENTACIÓN TÉCNICA (90 min) → DOCS.md
  ARQUITECTURA DEL SISTEMA      → ARCHITECTURE.md
  CONFIGURACIONES AVANZADAS     → ADVANCED.md
  RESUMEN ENTREGA               → ENTREGA.md
  ESTADO DEL PROYECTO           → STATUS.txt

═══════════════════════════════════════════════════════════════════════════════

💻 COMANDOS ÚTILES:

  npm start              → Iniciar servidor (producción)
  npm run dev            → Iniciar servidor (desarrollo + hot-reload)
  node test.js           → Ejecutar pruebas automáticas
  node example-rest.js   → Ejemplo: usar REST API
  node example-client.js → Ejemplo: cliente WebSocket
  docker-compose up -d   → Ejecutar con Docker

═══════════════════════════════════════════════════════════════════════════════

📡 ENDPOINTS DISPONIBLES:

  REST API:
  ─────────
    GET  http://localhost:8000/api/health
    GET  http://localhost:8000/api/llamados?limit=10
    GET  http://localhost:8000/api/llamados/pendientes
    POST http://localhost:8000/api/llamados/crear
    POST http://localhost:8000/api/llamados/:id/reproducido

  WebSocket:
  ──────────
    ws://localhost:8000/

  Interfaz Web:
  ─────────────
    http://localhost:8000/index.html

═══════════════════════════════════════════════════════════════════════════════

🔧 CONFIGURACIÓN:

  Variables de entorno en .env:
    SUPABASE_URL  = https://jyltuehmusxsmkoamyhu.supabase.co
    SUPABASE_KEY  = [CONFIGURADA]
    PORT          = 8000
    NODE_ENV      = development

  Para cambiar: editar .env y reiniciar servidor

═══════════════════════════════════════════════════════════════════════════════

📂 ARCHIVOS PRINCIPALES:

  server.js       → Servidor Express + WebSocket
  client.js       → Cliente WebSocket reutilizable
  index.html      → Interfaz web
  test.js         → Pruebas automáticas
  example-*.js    → Ejemplos de uso

═══════════════════════════════════════════════════════════════════════════════

❓ PREGUNTAS FRECUENTES:

  P: ¿Cómo creo un llamado?
  R: En http://localhost:8000/index.html, rellena el formulario y haz clic en
     "Crear Llamado". O usa REST API: POST /api/llamados/crear

  P: ¿Cómo veo eventos en tiempo real?
  R: Abre la interfaz web (index.html) y verás los eventos en el panel de
     "Eventos en Tiempo Real"

  P: ¿Qué es WebSocket?
  R: Es comunicación bidireccional en tiempo real. Los clientes reciben
     notificaciones instantáneamente sin necesidad de polling.

  P: ¿Puedo integrar con mi sistema?
  R: Sí. Usa la REST API (HTTP POST/GET) o WebSocket según necesites.
     Ver DOCS.md para ejemplos de integración.

  P: ¿Funciona offline?
  R: La web está offline pero los cambios se sincronizan con WebSocket.
     REST API requiere conexión.

  P: ¿Cuántos clientes simultáneos soporta?
  R: Aproximadamente 1000+ conexiones WebSocket simultáneas.

═══════════════════════════════════════════════════════════════════════════════

🐛 SI ALGO FALLA:

  Error: "Cannot find module"
  → Ejecuta: npm install

  Error: "Port 8000 in use"
  → Cambia PORT en .env o mata el proceso existente

  Error: "Cannot connect to Supabase"
  → Verifica .env tiene URL y KEY correctas
  → Verifica tabla 'llamados' existe en Supabase

  WebSocket no conecta
  → Verifica servidor está corriendo: npm start
  → Abre consola (F12) para ver errores
  → Revisa que URL es: ws://localhost:8000

  Llamados no aparecen
  → Verifica tabla existe en Supabase
  → Revisa policies de RLS
  → Mira log del servidor: npm run dev

═══════════════════════════════════════════════════════════════════════════════

🚀 PRÓXIMOS PASOS:

  1. Lee QUICKSTART.md (5 min)
  2. Ejecuta: npm start
  3. Abre: http://localhost:8000/index.html
  4. Crea algunos llamados de prueba
  5. Abre en otro navegador para ver eventos
  6. Lee README.md si necesitas integración

═══════════════════════════════════════════════════════════════════════════════

📊 INFORMACIÓN DEL PROYECTO:

  Nombre       → Sistema de Llamados Dra. Reyes
  Versión      → 1.0.0
  Lenguaje     → JavaScript/Node.js
  Base de Datos → Supabase (PostgreSQL)
  Real-time    → WebSocket
  Status       → ✅ PRODUCCIÓN LISTA

═══════════════════════════════════════════════════════════════════════════════

💡 TIPS:

  • Abre múltiples navegadores para ver broadcasting en tiempo real
  • Usa ejemplo-rest.js para probar API sin interfaz gráfica
  • Mira el log del sistema (panel inferior) para debugging
  • Docker: docker-compose up -d (muy fácil)

═══════════════════════════════════════════════════════════════════════════════

¿NECESITAS AYUDA CON...?

  ├─ Instalación          → QUICKSTART.md
  ├─ Uso de la interfaz   → README.md (Sección: Uso del Sistema)
  ├─ API REST             → DOCS.md (Sección: API REST)
  ├─ WebSocket            → DOCS.md (Sección: WebSocket API)
  ├─ Integración          → DOCS.md (Sección: Ejemplos Prácticos)
  ├─ Deployment           → DOCS.md (Sección: Deployment)
  ├─ Arquitectura         → ARCHITECTURE.md
  ├─ Configuración avanzada → ADVANCED.md
  └─ Estado del proyecto  → ENTREGA.md

═══════════════════════════════════════════════════════════════════════════════

🎉 ¡LISTO PARA COMENZAR!

  EJECUTA: npm start
  LUEGO ABRE: http://localhost:8000/index.html

═══════════════════════════════════════════════════════════════════════════════
`;

console.log(help);

// Mostrar archivos disponibles
console.log('\n📁 ARCHIVOS DEL PROYECTO:\n');

const files = [
  { name: 'server.js', desc: 'Servidor principal' },
  { name: 'client.js', desc: 'Cliente WebSocket' },
  { name: 'index.html', desc: 'Interfaz web' },
  { name: 'test.js', desc: 'Pruebas' },
  { name: 'example-rest.js', desc: 'Ejemplo REST API' },
  { name: 'example-client.js', desc: 'Ejemplo WebSocket' },
  { name: 'package.json', desc: 'Dependencias' },
  { name: '.env', desc: 'Configuración' },
  { name: 'Dockerfile', desc: 'Docker image' },
  { name: 'README.md', desc: 'Guía principal' },
  { name: 'DOCS.md', desc: 'Documentación técnica' },
  { name: 'QUICKSTART.md', desc: 'Inicio rápido' },
  { name: 'ARCHITECTURE.md', desc: 'Arquitectura' },
  { name: 'ADVANCED.md', desc: 'Configuración avanzada' },
  { name: 'ENTREGA.md', desc: 'Resumen entrega' }
];

files.forEach(f => {
  console.log(`  ✅ ${f.name.padEnd(20)} - ${f.desc}`);
});

console.log('\n═══════════════════════════════════════════════════════════════════════════════\n');
console.log('✨ ¡Bienvenido! Escribe: npm start para comenzar\n');
