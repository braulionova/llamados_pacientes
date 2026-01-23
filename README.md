# 🏥 Sistema de Llamados - Consultorio Dra. Reyes

[![Vercel Status](https://img.shields.io/badge/Deployed%20on-Vercel-black)](https://vercel.com)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-ISC-blue)](LICENSE)

Sistema de llamados en tiempo real para consultorio médico con voz dominicana integrada y conexión única optimizada.

## ✨ Características Principales

### 🎤 Voz Dominicana
- **Prioridad voz dominicana**: Busca voces específicas de República Dominicana
- **Fallback inteligente**: Caribeñas → Latinoamericanas → Español general
- **Texto adaptado**: "por favor pasar" para contexto dominicano
- **Múltiples idiomas**: Soporte para español, inglés y variantes latinas

### 🔗 Gestión de Conexiones
- **1 conexión activa**: Evita múltiples conexiones simultáneas
- **Limpieza automática**: Elimina conexiones muertas
- **Heartbeat**: Mantiene conexiones vivas
- **Monitor en tiempo real**: Dashboard de estado de conexiones

### 📡 Comunicación en Tiempo Real
- **WebSocket**: Conexión instantánea (desarrollo)
- **Polling**: Alternativa para producción Vercel
- **Broadcast**: Mensajes a todos los clientes conectados
- **Supabase Integration**: Base de datos en tiempo real

### 🎨 Interfaz Web
- **Diseño responsive**: Adaptado para móviles y desktop
- **Animaciones**: Transiciones suaves y modernas
- **Modo oscuro**: Interfaz elegante y profesional
- **Autoplay**: Sistema automático de llamados

## 🚀 Demo Live

**[🌐 Ver Demostración](https://llamados-dra-reyes.vercel.app)**

## 📋 Requisitos

### Desarrollo Local
- Node.js >= 18.0.0
- npm o yarn
- Cuenta de Supabase

### Producción
- Cuenta de Vercel (para deployment)
- Variables de entorno configuradas

## 🛠️ Instalación

### Clonar Repositorio
```bash
git clone https://github.com/usuario/llamados-dra-reyes.git
cd llamados-dra-reyes
```

### Instalar Dependencias
```bash
npm install
```

### Configurar Variables de Entorno
```bash
cp .env.example .env
```
Editar `.env`:
```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_key_de_supabase
NODE_ENV=development
PORT=8000
```

## 🏃‍♂️ Ejecutar Localmente

### Modo Desarrollo
```bash
npm run dev
```
- Servidor en http://localhost:8000
- WebSocket habilitado
- Recarga automática

### Modo Producción Local
```bash
npm start
```
- Servidor optimizado
- Sin recarga automática

## 🌐 Deployment

### Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm install -g vercel

# Desplegar
vercel --prod

# O usar script preparado
deploy.bat  # Windows
./deploy.sh  # Linux/Mac
```

### Otras Plataformas
- **Heroku**: Configurar Procfile y variables
- **Railway**: Compatible con Docker
- **DigitalOcean**: Usar App Platform

## 📁 Estructura del Proyecto

```
llamados-dra-reyes/
├── 📁 api/
│   └── 📄 index.js          # Serverless function Vercel
├── 📄 server.js             # Servidor local
├── 📄 index.html            # Página principal
├── 📄 autoplay.html         # Sistema automático con voz
├── 📄 conexiones.html       # Monitor de conexiones
├── 📄 vercel.json          # Configuración Vercel
├── 📄 package.json          # Dependencias
├── 📄 .env.example         # Variables de entorno ejemplo
└── 📄 README.md            # Este archivo
```

## 🎯 Uso del Sistema

### 1. Acceso Principal
- **URL**: http://localhost:8000 o https://dominio.com
- **Funciones**: Crear llamados, ver historial

### 2. Sistema Automático
- **URL**: http://localhost:8000/autoplay.html
- **Función**: Reproducción automática con voz
- **Configuración**: Volumen, velocidad, idioma

### 3. Monitor de Conexiones
- **URL**: http://localhost:8000/conexiones.html
- **Función**: Ver estado de conexiones activas
- **Control**: Limpiar, resetear conexiones

## 🔧 Configuración de Voz

### Idiomas Disponibles
- 🇩🇴 **Español (República Dominicana)** - Prioritario
- 🇪🇸 Español (España)
- 🇲🇽 Español (México)
- 🇦🇷 Español (Argentina)
- 🇨🇴 Español (Colombia)
- 🇵🇪 Español (Perú)
- 🇺🇸 English (US)

### Parámetros
- **Volumen**: 0-100%
- **Velocidad**: 0.5x - 2.0x
- **Retraso**: Tiempo antes de reproducir

## 📊 API Endpoints

### Health Check
```
GET /api/health
```

### Gestión de Llamados
```
GET    /api/llamados              # Listar llamados
GET    /api/llamados/pendientes   # Llamados pendientes
POST   /api/llamados/crear        # Crear nuevo llamado
POST   /api/llamados/:id/reproducido  # Marcar como reproducido
```

### Gestión de Conexiones
```
GET    /api/conexiones           # Estado de conexiones
POST   /api/limpiar-conexiones   # Limpiar conexiones muertas
POST   /api/reset-conexiones     # Resetear todas las conexiones
```

## 🎨 Personalización

### Cambiar Logo/Branding
Editar archivos HTML:
```html
<header>
  <h1>🏥 Tu Nombre</h1>
  <p>Tu Consultorio</p>
</header>
```

### Modificar Colores
En CSS:
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Configurar Supabase
Crear tabla `llamados`:
```sql
CREATE TABLE llamados (
  id SERIAL PRIMARY KEY,
  turno_numero INTEGER NOT NULL,
  paciente_nombre VARCHAR(255) NOT NULL,
  consultorio VARCHAR(50) NOT NULL,
  texto_completo TEXT,
  reproducido BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🐛 Troubleshooting

### WebSocket No Funciona
- **Local**: Revisar puerto y firewall
- **Vercel**: Normal, usa polling fallback

### Voz No Suena
- Verificar permisos del navegador
- Probar diferente navegador
- Revisar configuración de audio del sistema

### Conexión Rebotando
- Reiniciar servidor
- Limpiar caché del navegador
- Verificar variables de entorno

### Supabase Error
- Verificar URL y API key
- Configurar CORS en Supabase
- Revisar permisos de tabla

## 📈 Mejoras Futuras

### 🔜 Próximas Características
- [ ] App móvil nativa
- [ ] Notificaciones push
- [ ] Integración con sistemas de gestión
- [ ] Múltiples consultorios
- [ ] Reportes y estadísticas
- [ ] Grabación de voz personalizada

### 🛣️ Roadmap
1. **v2.0**: App móvil + Notificaciones
2. **v2.1**: Múltiples consultorios
3. **v2.2**: Reportes avanzados
4. **v3.0**: IA para optimización

## 🤝 Contribuir

### Cómo Contribuir
1. **Fork** el proyecto
2. **Crear rama**: `git checkout -b feature/nueva-funcionalidad`
3. **Commits descriptivos**: `git commit -m "Add nueva funcionalidad"`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. **Pull Request**: Explicar cambios

### Estilo de Código
- **Indentación**: 2 espacios
- **Comentarios**: Español preferentemente
- **Nombres**: Descriptivos y en español
- **ESLint**: Configurado para consistencia

## 📄 Licencia

[MIT License](LICENSE) - Uso libre con atribución

## 👥 Créditos

- **Desarrollo**: [Tu Nombre]
- **Voz Dominicana**: Texto adaptado para contexto RD
- **Diseño**: Interfaz moderna y responsive
- **Backend**: Node.js + Express + WebSocket

## 📞 Contacto

- **Email**: tu-email@dominio.com
- **GitHub**: https://github.com/usuario
- **Demo**: https://llamados-dra-reyes.vercel.app

---

⭐ **Si te gusta el proyecto, dale una estrella en GitHub!**

🚀 **Hecho con ❤️ para el sistema de salud**