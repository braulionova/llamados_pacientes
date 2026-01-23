@echo off
echo 🚀 Preparando despliegue en Vercel...
echo.

REM Verificar si está instalado Vercel CLI
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI no está instalado
    echo 📦 Instalando Vercel CLI...
    npm install -g vercel
)

REM Verificar archivo vercel.json
if not exist "vercel.json" (
    echo ❌ vercel.json no encontrado
    pause
    exit /b 1
)

REM Verificar package.json
if not exist "package.json" (
    echo ❌ package.json no encontrado
    pause
    exit /b 1
)

REM Verificar variables de entorno
if not exist ".env" (
    echo ⚠️  Archivo .env no encontrado
    echo 📝 Creando archivo .env de ejemplo...
    (
        echo SUPABASE_URL=tu_supabase_url
        echo SUPABASE_KEY=tu_supabase_key
        echo NODE_ENV=production
    ) > .env
    echo ❗ Por favor, completa las variables en .env
    pause
    exit /b 1
)

echo ✅ Todo listo para el despliegue
echo.

REM Desplegar
echo 🌐 Iniciando despliegue en Vercel...
vercel --prod

echo.
echo 🎉 Despliegue completado!
echo.
echo 📋 Siguientes pasos:
echo 1. Configura las variables de entorno en el dashboard de Vercel
echo 2. Verifica el despliegue en https://vercel.com/dashboard
echo 3. Prueba la aplicación en la URL proporcionada
echo.
echo 📖 Para más información, consulta DEPLOYMENT_VERCEL.md
pause