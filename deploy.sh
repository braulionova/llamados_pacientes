#!/bin/bash

echo "🚀 Preparando despliegue en Vercel..."
echo ""

# Verificar si está instalado Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI no está instalado"
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Verificar variables de entorno
if [ ! -f ".env" ]; then
    echo "⚠️  Archivo .env no encontrado"
    echo "📝 Creando archivo .env de ejemplo..."
    cat > .env << EOL
SUPABASE_URL=https://jyltuehmusxsmkoamyhu.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp5bHR1ZWhtdXN4c21rb2FteWh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1NzU4NTIsImV4cCI6MjA1ODE1MTg1Mn0.9qR5fpq4RzT_lVi6nrDEWHWgMHQJfLRz1f23ULEa-ko
NODE_ENV=production
EOL
    echo "❗ Por favor, completa las variables en .env"
    exit 1
fi

# Verificar archivo vercel.json
if [ ! -f "vercel.json" ]; then
    echo "❌ vercel.json no encontrado"
    exit 1
fi

# Verificar package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json no encontrado"
    exit 1
fi

echo "✅ Todo listo para el despliegue"
echo ""

# Desplegar
echo "🌐 Iniciando despliegue en Vercel..."
vercel --prod

echo ""
echo "🎉 Despliegue completado!"
echo ""
echo "📋 Siguientes pasos:"
echo "1. Configura las variables de entorno en el dashboard de Vercel"
echo "2. Verifica el despliegue en https://vercel.com/dashboard"
echo "3. Prueba la aplicación en la URL proporcionada"
echo ""
echo "📖 Para más información, consulta DEPLOYMENT_VERCEL.md"