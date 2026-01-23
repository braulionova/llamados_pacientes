# 🚀 Despliegue en Vercel

## Preparación del Proyecto

El proyecto ha sido configurado para despliegue en Vercel con los siguientes cambios:

### Archivos de Configuración

1. **`vercel.json`** - Configuración principal de Vercel
2. **`api/index.js`** - Servidor optimizado para serverless functions
3. **`.vercelignore`** - Archivos excluidos del despliegue
4. **`package.json`** - Actualizado para producción

### Características Implementadas

✅ **CORS configurado** para producción
✅ **Serverless Functions** optimizadas
✅ **Variables de entorno** configuradas
✅ **Headers CORS** adicionales
✅ **Build script** configurado
✅ **Node.js 18+** requerido

## 🚀 Pasos para Despliegue

### 1. Instalar Vercel CLI

```bash
npm install -g vercel
```

### 2. Configurar Variables de Entorno

En el dashboard de Vercel o mediante CLI:

```bash
vercel env add SUPABASE_URL
vercel env add SUPABASE_KEY
```

### 3. Desplegar

```bash
# Login en Vercel
vercel login

# Despliegue
vercel --prod
```

## ⚙️ Configuración Variables de Entorno

Las siguientes variables son requeridas:

- `SUPABASE_URL`: URL de tu proyecto Supabase
- `SUPABASE_KEY`: Key pública de Supabase
- `NODE_ENV`: production (automático en Vercel)

## 📁 Estructura del Proyecto

```
llamados-dra-reyes/
├── api/
│   └── index.js          # Serverless function principal
├── public/
│   ├── index.html        # Página principal
│   ├── autoplay.html     # Sistema automático
│   ├── conexiones.html   # Monitor de conexiones
│   └── ...
├── vercel.json          # Configuración de Vercel
├── package.json          # Dependencias y scripts
├── .vercelignore        # Archivos excluidos
└── server.js            # Servidor local (dev)
```

## 🌐 Limitaciones en Vercel

### WebSocket
Las WebSocket no son totalmente compatibles con Vercel serverless. Para producción:

1. **Opción A**: Usar WebSockets vía terceros (Pusher, Socket.io Cloud)
2. **Opción B**: Polling desde cliente (implementado)
3. **Opción C**: Servidor dedicado para WebSocket

### Conexiones
- Límite: 1 conexión activa por diseño
- Timeout: 10 segundos por función
- Memoria: 1GB por defecto

## 🔧 Configuración Adicional

### Headers CORS
```json
"headers": [
  {
    "source": "/(.*)",
    "headers": [
      {
        "key": "Access-Control-Allow-Origin",
        "value": "*"
      }
    ]
  }
]
```

### Functions
```json
"functions": {
  "server.js": {
    "maxDuration": 10
  }
}
```

## 📊 Monitorización

Una vez desplegado, puedes verificar:

1. **Health Check**: `https://tu-app.vercel.app/api/health`
2. **API Status**: `https://tu-app.vercel.app/api/conexiones`
3. **Logs**: Dashboard de Vercel

## 🔄 Actualizaciones

Para actualizar el proyecto:

```bash
# Realizar cambios
git add .
git commit -m "Actualización"
git push

# Redesplegar
vercel --prod
```

## 🎯 URLs Importantes

- **Producción**: `https://tu-app.vercel.app`
- **API Base**: `https://tu-app.vercel.app/api`
- **Autoplay**: `https://tu-app.vercel.app/autoplay.html`
- **Monitor**: `https://tu-app.vercel.app/conexiones.html`

## 🚨 Troubleshooting

### Error 500
- Verificar variables de entorno
- Revisar logs en dashboard Vercel

### CORS Issues
- Verificar headers en `vercel.json`
- Revisar origen de las peticiones

### WebSocket No Funciona
- Es normal en Vercel serverless
- El sistema usará polling como fallback

## 📝 Notas Importantes

1. **Sin WebSocket** en Vercel serverless
2. **Polling** como alternativa para tiempo real
3. **1 conexión** por diseño (sin cambios)
4. **Voz Dominicana** implementada
5. **Responsive** y optimizado

## ✅ Checklist Pre-Despliegue

- [ ] Variables de entorno configuradas
- [ ] `vercel.json` creado
- [ ] `.vercelignore` configurado
- [ ] `package.json` actualizado
- [ ] `api/index.js` listo
- [ ] Test local funcionando
- [ ] Git commit finalizado

---

**Listo para producción en Vercel!** 🎉