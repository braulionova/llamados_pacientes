# 🎯 GUÍA COMPLETA - Sistema Autoplay en Tiempo Real

## ✅ Estado Actual del Sistema

Tu sistema **ya está funcionando** y completamente integrado. Aquí está lo que tienes:

```
✅ Servidor Node.js corriendo en puerto 8000
✅ Monitor de Supabase activo (polling cada 1 segundo)
✅ WebSocket para broadcast en tiempo real
✅ Autoplay.html listo para usar
✅ API REST funcional
✅ Base de datos conectada
```

---

## 🚀 ¿Cómo Empezar?

### Paso 1: Abre Autoplay en tu navegador

```
http://localhost:8000/autoplay.html
```

### Paso 2: En otra ventana, crea un llamado

```
http://localhost:8000/index.html
```

O usa este comando para crear un llamado:

```bash
curl -X POST http://localhost:8000/api/llamados/crear \
  -H "Content-Type: application/json" \
  -d '{
    "turno_numero": 101,
    "paciente_nombre": "Juan Pérez",
    "consultorio": 2
  }'
```

### Paso 3: ¡Listo! 

Deberías ver:
- ✅ El turno aparece en autoplay.html
- ✅ Se reproduce automáticamente la voz
- ✅ Se muestra en pantalla grande

---

## 🎤 Qué Sucede Internamente

### 1️⃣ Insertar en Supabase (autoplay.html o API)

```
Turno 101 - Juan Pérez - Consultorio 2
```

### 2️⃣ Server Detecta (cada 1 segundo)

El monitor en `server.js` ejecuta:
```javascript
SELECT * FROM llamados WHERE id > ultimoIdMonitoreado
```

### 3️⃣ Broadcast a Clientes

Todos los clientes conectados reciben:
```json
{
  "type": "nuevo_llamado",
  "data": {
    "turno_numero": 101,
    "paciente_nombre": "Juan Pérez",
    "consultorio": 2
  }
}
```

### 4️⃣ Reproducción Automática

El navegador:
1. Recibe el evento
2. Muestra en pantalla
3. Reproduce con síntesis de voz:
   > "Turno número 101, Juan Pérez, favor pasar al consultorio 2"

---

## 📱 Accesos Rápidos

| Función | URL/Comando |
|---------|-------------|
| **Reproducción automática** | http://localhost:8000/autoplay.html |
| **Panel de control** | http://localhost:8000/index.html |
| **Crear llamado** | POST /api/llamados/crear |
| **Ver llamados** | GET /api/llamados |
| **Ver pendientes** | GET /api/llamados/pendientes |
| **Marcar reproducido** | PUT /api/llamados/:id/reproducido |

---

## 🔧 Configuración de Voz (en Autoplay)

En la página `autoplay.html` puedes ajustar:

### Volumen 🔊
- Barra deslizable: 0% a 100%
- Afecta solo la síntesis de voz

### Velocidad 🎯
- Opciones: 0.5x, 1x, 1.5x, 2x
- Más rápido = menos tiempo de reproducción

### Idioma 🗣️
- Español (España)
- Español (México)  
- Español (Argentina)
- Inglés (USA)

### Retraso ⏱️
- Milisegundos antes de reproducir
- Evita que dos llamados suenen simultáneamente
- Valor recomendado: 500-1000 ms

---

## 🔍 Verificar que Todo Funciona

### Test 1: Servidor está corriendo

```bash
# Deberías recibir 200 OK
curl http://localhost:8000/api/health
```

### Test 2: Autoplay.html existe

```bash
# Abre en navegador
http://localhost:8000/autoplay.html
```

### Test 3: Botón de prueba de audio

En autoplay.html, haz clic en el botón **"🔊 Prueba de Audio"**
- Deberías escuchar: "Prueba de audio número 1"

### Test 4: Crear un llamado real

En autoplay.html o index.html:
1. Llena los datos (turno, paciente, consultorio)
2. Haz clic en "Crear"
3. **Autoplay debe reproducir automáticamente**

---

## 💡 Troubleshooting

### Problema: No reproduce sonido

**Solución 1: Volumen del navegador**
- Verifica que el slider de volumen está al máximo
- Comprueba volumen del sistema operativo

**Solución 2: Permisos de audio**
- Algunos navegadores requieren permisos
- Verifica en Configuración → Privacidad → Audio

**Solución 3: Voces disponibles**
- Algunos idiomas no tienen voces
- Intenta con otro idioma
- Usa el botón "🔊 Prueba" para probar

**Solución 4: Revisa la consola**
- Presiona F12 en autoplay.html
- Ve a la pestaña "Console"
- Busca mensajes de error rojo

### Problema: No aparecen nuevos llamados

**Solución 1: WebSocket desconectado**
- Revisa el indicador de conexión (debe estar verde)
- En consola, busca errores de conexión
- Verifica que localhost:8000 es accesible

**Solución 2: Supabase no conecta**
- Verifica que .env tiene credenciales correctas
- Prueba: curl http://localhost:8000/api/llamados
- Deberías obtener un JSON con los llamados

**Solución 3: Monitor no está corriendo**
- Verifica que server.js está ejecutándose
- Busca "Iniciando monitor de Supabase" en logs del servidor

### Problema: Múltiples reproduciones

**Solución**: Aumenta el valor de "Retraso" en Autoplay
- Ejemplo: 1500 ms entre llamados

---

## 📊 Componentes del Sistema

### 1. Server.js (Backend)

```javascript
// Monitorea Supabase cada 1 segundo
// Detecta nuevos registros (id > ultimoIdMonitoreado)
// Hace broadcast a través de WebSocket
```

**Ubicación**: `c:\python\llamar_paciente_dra_reyes_v3\server.js`

**Función principal**: `iniciarMonitorSupabase()` (línea ~227)

### 2. Autoplay.html (Frontend)

```javascript
// Se conecta al WebSocket del servidor
// Escucha eventos 'nuevo_llamado'
// Reproduce automáticamente con síntesis de voz
// Muestra en pantalla
```

**Ubicación**: `c:\python\llamar_paciente_dra_reyes_v3\autoplay.html`

**Características**:
- 717 líneas de código
- Interfaz responsiva
- Log de eventos
- Estadísticas en tiempo real

### 3. Monitor.js (Alternativa)

Opcionalmente, puedes ejecutar:

```bash
node monitor.js
```

Esto reproduce automáticamente desde la línea de comandos (solo consola, sin interfaz visual).

---

## 🎓 Cómo Personalizarlo

### Cambiar intervalo de polling

En `server.js`, busca esta línea (~250):

```javascript
}, 1000); // 1000 milisegundos = 1 segundo
```

Cambia a:
- 500 para más rápido (cada 500ms)
- 2000 para más lento (cada 2 segundos)

### Cambiar puerto del servidor

En `server.js`, busca (línea ~22):

```javascript
const PORT = process.env.PORT || 8000;
```

Cambia 8000 al puerto que desees (ej: 3000)

### Cambiar idioma por defecto

En `autoplay.html`, busca (línea ~200):

```javascript
LANGUAGE: 'es-ES', // Cambiar aquí
```

Opciones:
- `es-ES` (Español España)
- `es-MX` (Español México)
- `es-AR` (Español Argentina)
- `en-US` (Inglés)

---

## 📡 Integraciones Externas

### Conectar desde tu sistema de agenda

```javascript
// En tu aplicación
async function registrarLlamado(paciente) {
  // El llamado se inserta en Supabase
  // El servidor lo detecta automáticamente
  // Autoplay.html lo reproduce
  
  const response = await fetch('http://localhost:8000/api/llamados/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      turno_numero: paciente.turno,
      paciente_nombre: paciente.nombre,
      consultorio: paciente.consultorio
    })
  });

  return response.json();
}
```

### Verificar llamados pendientes

```javascript
async function obtenerPendientes() {
  const response = await fetch('http://localhost:8000/api/llamados/pendientes');
  const llamados = await response.json();
  console.log('Pendientes:', llamados);
}
```

---

## 🔐 Seguridad

### Credenciales Supabase

Tu `.env` contiene:
```
SUPABASE_URL=...
SUPABASE_API_KEY=...
```

⚠️ **No compartas este archivo**

### CORS Habilitado

Actualmente el servidor acepta:
```
Access-Control-Allow-Origin: *
```

Para producción, cambia en `server.js`:
```javascript
app.use(cors({
  origin: 'https://tu-dominio.com'
}));
```

---

## 📈 Próximos Pasos

### Fase 1: Validación ✅ (Actual)
- Abre autoplay.html
- Crea un llamado
- Verifica reproducción automática

### Fase 2: Integración
- Conecta con tu sistema de citas
- Prueba con múltiples clientes simultáneos
- Ajusta configuración según necesites

### Fase 3: Producción
- Despliega en servidor (Heroku, AWS, etc)
- Usa Docker: `docker-compose up`
- Configura dominio propio

---

## 📚 Archivos Importantes

```
c:\python\llamar_paciente_dra_reyes_v3\
├── server.js              ← Backend con monitor
├── autoplay.html          ← Interfaz principal (ABRIR AQUÍ)
├── index.html             ← Panel de control
├── monitor.js             ← Monitor alternativo
├── client.js              ← Cliente WebSocket reutilizable
├── .env                   ← Credenciales Supabase
├── package.json           ← Dependencias
└── AUTOPLAY.md            ← Este archivo
```

---

## 🆘 Ayuda Rápida

**¿Por qué no escucho nada?**
- Revisa volumen del navegador + sistema
- Haz clic en "🔊 Prueba"
- Verifica que el navegador permite audio

**¿Por qué no aparecen nuevos llamados?**
- Verifica indicador de conexión (verde)
- Abre Console (F12) y busca errores
- Verifica que el servidor está corriendo

**¿Cómo creo múltiples llamados?**
- Crea en `index.html`
- O usa la API: `POST /api/llamados/crear`
- O inserta directamente en Supabase

**¿Cómo funciona el WebSocket?**
- Servidor y navegador se comunican en tiempo real
- No requiere actualizar la página
- Eventos se reciben al instante

---

## 🎉 ¡Listo para Usar!

Tu sistema está **completamente funcional**. Solo:

1. Abre: **http://localhost:8000/autoplay.html**
2. Crea un llamado en: **http://localhost:8000/index.html**
3. ¡Escucha la reproducción automática!

**¿Preguntas?** Revisa la documentación en `AUTOPLAY.md` o `DOCS.md`

---

**Última actualización**: Diciembre 2024
**Sistema**: Node.js + Supabase + WebSocket
**Estado**: ✅ Producción Ready
