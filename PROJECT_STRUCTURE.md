# 📁 Estructura del Proyecto para Vercel

## 🗂️ Archivos Principales

### Configuración de Despliegue
```
📄 vercel.json          # Configuración principal de Vercel
📄 .vercelignore        # Archivos excluidos del despliegue
📄 deploy.bat          # Script de despliegue (Windows)
📄 deploy.sh           # Script de despliegue (Linux/Mac)
📄 DEPLOYMENT_VERCEL.md # Documentación completa
```

### Servidor
```
📁 api/
└── 📄 index.js         # Serverless function para Vercel
📄 server.js           # Servidor local (desarrollo)
```

### Frontend
```
📄 index.html          # Página principal del sistema
📄 autoplay.html       # Sistema automático con voz Dominicana
📄 conexiones.html     # Monitor de conexiones
📄 monitor.html        # Monitor de Supabase
```

### Configuración
```
📄 package.json        # Dependencias y scripts
📄 .env               # Variables de entorno (local)
📄 .gitignore         # Archivos ignorados por Git
```

## 🎯 Características Implementadas

### ✅ Vercel Ready
- Serverless functions configuradas
- CORS headers incluidos
- Build script personalizado
- Variables de entorno configuradas

### ✅ Funcionalidad
- Voz Dominicana prioritaria
- 1 conexión activa máxima
- Monitor en tiempo real
- Sistema de llamados automático

### ✅ Optimizaciones
- Archivos innecesarios excluidos
- Modo desarrollo/producción
- Headers optimizados
- Logs informativos

## 🚀 Comandos Útiles

### Desarrollo Local
```bash
npm start              # Iniciar servidor local
npm run dev           # Modo desarrollo con watch
```

### Despliegue
```bash
vercel                # Despliegue preview
vercel --prod         # Despliegue producción
deploy.bat            # Script Windows
```

### Variables de Entorno
```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
```

## 📦 Dependencias Principales

```json
{
  "express": "Servidor web",
  "ws": "WebSocket (local)",
  "@supabase/supabase-js": "Base de datos",
  "cors": "CORS headers",
  "dotenv": "Variables entorno"
}
```

## 🌐 URLs de Producción

- **Principal**: `https://app.vercel.app/`
- **API**: `https://app.vercel.app/api/`
- **Autoplay**: `https://app.vercel.app/autoplay.html`
- **Monitor**: `https://app.vercel.app/conexiones.html`

## ⚠️ Limitaciones Vercel

- **WebSocket**: No disponible en serverless (polling fallback)
- **Timeout**: 10 segundos por función
- **Concurrentes**: Limitado por plan Vercel
- **Almacenamiento**: Solo archivos estáticos

## 🔄 Flujo de Trabajo

1. **Desarrollo**: `npm run dev` (local con WebSocket)
2. **Testing**: Verificar funcionalidad completa
3. **Despliegue**: `vercel --prod` (producción sin WebSocket)
4. **Monitor**: Dashboard Vercel para logs

---

**Proyecto 100% listo para Vercel** 🎉