# 🎯 TARJETA DE REFERENCIA RÁPIDA

## ⚡ INICIAR AHORA

### En tu navegador:
```
http://localhost:8000/autoplay.html
```

### Crear un llamado:
```
http://localhost:8000/index.html
```

### Resultado:
```
🔊 Autoplay reproduce automáticamente
```

---

## 🔧 COMANDOS ÚTILES

### Ver si el servidor está corriendo:
```bash
curl http://localhost:8000/api/health
# Respuesta: 200 OK
```

### Crear llamado por terminal:
```bash
curl -X POST http://localhost:8000/api/llamados/crear \
  -H "Content-Type: application/json" \
  -d '{"turno_numero":1,"paciente_nombre":"Juan","consultorio":2}'
```

### Ver todos los llamados:
```bash
curl http://localhost:8000/api/llamados
```

### Ver solo pendientes:
```bash
curl http://localhost:8000/api/llamados/pendientes
```

### Marcar como reproducido:
```bash
curl -X PUT http://localhost:8000/api/llamados/1/reproducido
```

---

## 📊 ESTRUCTURA

```
┌─ Supabase (Base de datos)
│
├─ Server.js (Monitor + WebSocket)
│  ├─ Polling cada 1 segundo
│  ├─ Detecta nuevos registros
│  └─ Broadcast a clientes
│
├─ Autoplay.html (Cliente 1)
│  ├─ Recibe eventos
│  ├─ Reproduce voz
│  └─ Muestra en pantalla
│
└─ Autoplay.html (Cliente 2, 3, ...)
   ├─ Recibe eventos
   ├─ Reproduce voz
   └─ Muestra en pantalla
```

---

## ⚙️ CONFIGURACIÓN

### Cambiar velocidad de polling
**Archivo**: `server.js` (línea ~250)
```javascript
}, 1000); // Milisegundos (1000 = 1 segundo)
```

### Cambiar idioma por defecto
**Archivo**: `autoplay.html` (línea ~200)
```javascript
LANGUAGE: 'es-ES' // es-ES, es-MX, es-AR, en-US
```

### Cambiar puerto
**Archivo**: `.env` o `server.js`
```javascript
PORT = 8000 // Cambiar aquí
```

---

## 🆘 PROBLEMAS RÁPIDOS

| Síntoma | Causa | Solución |
|---------|-------|----------|
| Sin sonido | Volumen bajo | ↑ Barra volumen en autoplay |
| No detecta llamados | WebSocket caído | F12 → Console → Ver errores |
| Erro conexión | Servidor caído | Terminal: `node server.js` |
| Puerto en uso | Puerto ocupado | Cambiar PORT en .env |
| Supabase error | Credenciales mal | Verificar .env |

---

## 📱 ACCESOS

| Elemento | URL/Comando |
|----------|-------------|
| Autoplay | http://localhost:8000/autoplay.html |
| Panel | http://localhost:8000/index.html |
| Health | http://localhost:8000/api/health |
| Llamados | http://localhost:8000/api/llamados |
| Monitor CLI | `node monitor.js` |

---

## 🎯 FLUJO TÍPICO

```
1. Abre autoplay.html en navegador

2. En otra ventana:
   - Crea llamado en index.html
   O
   - Inserta en Supabase
   O
   - Usa curl command

3. Server detecta cambio (< 1 segundo)

4. Broadcast por WebSocket

5. Autoplay recibe evento

6. 🔊 Reproduce automáticamente

7. Log muestra actividad

8. Estadísticas se actualizan
```

---

## 🚀 DATOS DE CONEXIÓN

```json
{
  "servidor": "localhost:8000",
  "websocket": "ws://localhost:8000",
  "api_base": "http://localhost:8000/api",
  "supabase": "variable desde .env",
  "polling": "cada 1 segundo",
  "timeout": "30 segundos"
}
```

---

## 📋 CREAR LLAMADO - DATOS REQUERIDOS

```javascript
{
  "turno_numero": 42,           // Número del turno (int)
  "paciente_nombre": "María",   // Nombre completo (string)
  "consultorio": 3              // Número consultorio (int)
}
```

---

## 🔊 CONFIGURACIÓN DE VOZ

**Elemento** | **Rango** | **Recomendado**
---|---|---
Volumen | 0-100% | 80%
Velocidad | 0.5x-2x | 1x
Retraso | 0-5000ms | 500ms
Idioma | 4 opciones | es-ES

---

## 💾 ARCHIVOS IMPORTANTES

```
server.js         ← Backend (NO EDITAR)
autoplay.html     ← Frontend principal (ABRIR AQUÍ)
index.html        ← Panel de control
monitor.js        ← Monitor alternativo
.env              ← Credenciales (SECRETO)
client.js         ← WebSocket reutilizable
```

---

## ✅ CHECKLIST DE INICIO

- [ ] Servidor corriendo: `node server.js`
- [ ] Abrir: `http://localhost:8000/autoplay.html`
- [ ] Crear llamado en `index.html`
- [ ] Escuchar reproducción
- [ ] Verificar log de eventos
- [ ] Revisar indicador de conexión (verde)

---

## 📞 EVENTOS WebSocket

### Cliente recibe:
```json
{
  "type": "nuevo_llamado",
  "data": {
    "turno_numero": 42,
    "paciente_nombre": "María",
    "consultorio": 3
  }
}
```

### Línea reproducida:
```
"Turno número 42, María, favor pasar al consultorio 3"
```

---

## 🎨 CUSTOMIZACIÓN RÁPIDA

### Cambiar formato de mensaje
**Archivo**: `autoplay.html` → Función `generateSpeech()`
```javascript
// Actual:
`Turno número ${data.turno_numero}, ${data.paciente_nombre}, 
 favor pasar al consultorio ${data.consultorio}`

// Cambiar a:
`Llamada para ${data.paciente_nombre}, consultorio ${data.consultorio}`
```

### Agregar campo extra
1. Inserta en Supabase (nueva columna)
2. Actualiza POST en server.js
3. Usa en autoplay.html

---

## 📡 INTEGRACIÓN EXTERNA

Tu sistema recibe POST desde cualquier aplicación:

```bash
# Desde tu agenda
curl -X POST http://localhost:8000/api/llamados/crear \
  -H "Content-Type: application/json" \
  -d '{
    "turno_numero": 101,
    "paciente_nombre": "Juan Pérez",
    "consultorio": 5
  }'

# Autoplay reproduce automáticamente
```

---

## 🎓 ESTO ES TODO LO QUE NECESITAS

✅ **Está corriendo**  
✅ **Funciona en tiempo real**  
✅ **Es automático**  
✅ **Listo para producción**  

### Solo:
1. Abre autoplay.html
2. Crea un llamado
3. ¡Disfruta!

---

## 🆘 ÚLTIMO RECURSO

Si algo no funciona:

1. **Servidor**: `node server.js` en terminal
2. **Consola**: Abre autoplay.html → F12 → Console
3. **API**: Verifica `curl http://localhost:8000/api/health`
4. **Supabase**: Confirma credenciales en `.env`
5. **WebSocket**: Busca errores de conexión en Console

---

**Versión**: 1.0.0  
**Estado**: ✅ Funcional  
**Última revisión**: Diciembre 2024

🎉 **¡Sistema listo para usar!**
