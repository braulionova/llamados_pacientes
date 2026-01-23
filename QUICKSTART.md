#!/bin/bash

# ==========================================
# GUÍA DE INICIO RÁPIDO
# ==========================================

echo "🏥 SISTEMA DE LLAMADO EN TIEMPO REAL - GUÍA RÁPIDA"
echo "=================================================="
echo ""

echo "📋 PASO 1: INSTALACIÓN"
echo "  npm install"
echo ""

echo "⚙️  PASO 2: CONFIGURACIÓN"
echo "  Editar .env con tus credenciales de Supabase"
echo "  SUPABASE_URL=https://your-project.supabase.co"
echo "  SUPABASE_KEY=your-anon-key"
echo ""

echo "🚀 PASO 3: EJECUTAR SERVIDOR"
echo "  npm start        (producción)"
echo "  npm run dev      (desarrollo con hot-reload)"
echo ""

echo "🌐 PASO 4: ACCEDER A LA INTERFAZ WEB"
echo "  Navegador: http://localhost:8000/index.html"
echo ""

echo "🧪 PASO 5: PRUEBAS"
echo "  # Terminal 1: iniciar servidor"
echo "  npm run dev"
echo ""
echo "  # Terminal 2: ejecutar pruebas"
echo "  node test.js"
echo ""

echo "📚 EJEMPLOS DE USO"
echo "  # Cliente WebSocket"
echo "  node example-client.js"
echo ""
echo "  # REST API"
echo "  node example-rest.js"
echo ""

echo "📖 DOCUMENTACIÓN COMPLETA"
echo "  Ver README.md para documentación detallada"
echo ""

echo "🔗 ENDPOINTS DISPONIBLES"
echo ""
echo "REST:"
echo "  GET  http://localhost:8000/api/health              - Estado del servidor"
echo "  GET  http://localhost:8000/api/llamados            - Últimos llamados"
echo "  GET  http://localhost:8000/api/llamados/pendientes - Llamados pendientes"
echo "  POST http://localhost:8000/api/llamados/crear      - Crear llamado"
echo "  POST http://localhost:8000/api/llamados/:id/reproducido - Marcar reproducido"
echo ""
echo "WebSocket:"
echo "  ws://localhost:8000                                - Conexión tiempo real"
echo ""

echo "=================================================="
echo "✅ Sistema listo para usar!"
echo "=================================================="
