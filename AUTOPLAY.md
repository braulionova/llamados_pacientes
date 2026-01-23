# 🎤 AUTOPLAY - Sistema Automático de Llamadas

## 📋 Descripción

Sistema que monitorea **en tiempo real** la tabla `llamados` de Supabase y **reproduce automáticamente** los nuevos pacientes registrados usando síntesis de voz.

Cuando un nuevo registro se inserta en la tabla, el sistema:
1. ✅ Lo detecta automáticamente
2. ✅ Lo transmite a través de WebSocket
3. ✅ Reproduce el llamado con síntesis de voz
4. ✅ Muestra la información en pantalla

---

## 🚀 Cómo Usar

### Opción 1: Interfaz Web Autoplay (Recomendado)

**Paso 1: Iniciar el servidor**
```bash
npm start
```

**Paso 2: Abrir en navegador**
```
http://localhost:8000/autoplay.html
```

**Paso 3: Crear llamados**
- Abre otra ventana con: http://localhost:8000/index.html
- O usa la REST API para crear llamados
- Verás que autoplay.html reproduzca automáticamente

### Opción 2: Monitor Node.js (Alternativa)

**Paso 1: Iniciar servidor principal**
```bash
npm start
```

**Paso 2: En otra terminal, iniciar monitor**
```bash
node monitor.js
```

El monitor mostrará en consola cada nuevo llamado y reproducirá automáticamente con síntesis de voz del sistema.

---

## 🎯 Características de Autoplay

### 🔊 Síntesis de Voz
- Reproducción automática de llamados
- Configurable en tiempo real:
  - **Volumen**: 0-100%
  - **Velocidad**: 0.5x - 2x
  - **Idioma**: Español (España, México, Argentina), Inglés

### 📊 Monitoreo en Tiempo Real
- Conexión WebSocket permanente
- Polling de Supabase cada segundo
- Detección instantánea de nuevos registros

### 🎨 Interfaz Visual
- Pantalla grande que muestra:
  - Número de turno
  - Nombre del paciente
  - Número de consultorio
- Log de eventos
- Indicador de estado de conexión
- Estadísticas (llamados reproducidos)

### ⚙️ Configuración
- Volumen ajustable
- Velocidad de voz configurable
- Selección de idioma
- Retraso antes de reproducir (para evitar simultáneo)

---

## 📡 Flujo de Datos

```
Nueva inserción en tabla 'llamados'
            ↓
    Monitor detecta cambio
            ↓
    Broadcast por WebSocket
            ↓
    autoplay.html recibe evento
            ↓
    Muestra en pantalla + reproduce voz
```

---

## 🔧 Configuración

### Monitor en Server.js

El servidor ahora monitorea automáticamente Supabase:
- **Intervalo**: 1 segundo
- **Método**: Polling (compatible con todas las versiones)
- **Evento**: Insertado automáticamente en WebSocket

Modificar en `server.js`:
```javascript
}, 1000); // Cambiar intervalo aquí (en milisegundos)
```

### Parámetros de Voz en Autoplay.html

En la interfaz:
- **Volumen**: Barra deslizable (0-100%)
- **Velocidad**: Rango de 0.5x a 2x
- **Idioma**: Selector dropdown
- **Retraso**: Campo de entrada (ms)

---

## 🎤 Ejemplo de Uso

### Crear un llamado (en index.html o API)

```bash
curl -X POST http://localhost:8000/api/llamados/crear \
  -H "Content-Type: application/json" \
  -d '{
    "turno_numero": 42,
    "paciente_nombre": "María García",
    "consultorio": 3
  }'
```

### Resultado en Autoplay

```
[SCREEN] Muestra grande:
         42
         María García
         Consultorio 3

[AUDIO]  Síntesis de voz:
         "Turno número 42, María García, favor pasar al consultorio 3"

[LOG]    🔊 Reproduciendo: Turno 42 - María García
```

---

## 📱 Accesos

| Página | URL | Función |
|--------|-----|---------|
| **Autoplay** | http://localhost:8000/autoplay.html | Reproducción automática |
| **Index** | http://localhost:8000/index.html | Panel de control |
| **Monitor** | Terminal: `node monitor.js` | Línea de comandos |

---

## 🔗 Integración con Sistemas Externos

### Crear llamado desde tu sistema

```javascript
async function crearLlamadoDesdeAgenda(paciente) {
  const response = await fetch('http://localhost:8000/api/llamados/crear', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      turno_numero: paciente.turno,
      paciente_nombre: paciente.nombre,
      consultorio: paciente.consultorio
    })
  });

  const result = await response.json();
  // Autoplay detectará automáticamente el nuevo registro
}
```

---

## 🐛 Troubleshooting

### No reproduce voz

**Problema**: La página no reproduce sonido
**Soluciones**:
1. Verificar que el navegador tiene permisos de audio
2. Revisar volumen del sistema
3. Revisar volumen en la interfaz (slider)
4. Probar con botón "🔊 Prueba de Audio"
5. Verificar que el idioma seleccionado tiene voces disponibles

### No detecta nuevos llamados

**Problema**: Autoplay no muestra nuevos registros
**Soluciones**:
1. Verificar que WebSocket está conectado (indicador verde)
2. Abrir consola del navegador (F12 → Console)
3. Buscar errores de conexión
4. Verificar que el servidor está corriendo: `npm start`
5. Comprobar que Supabase está accesible

### Audio del sistema muy bajo/alto

**Solución**:
1. Ajustar volumen del slider en Autoplay
2. Verificar volumen del sistema operativo
3. Seleccionar otro idioma/voz
4. Ajustar velocidad de voz

---

## 💡 Tips y Trucos

1. **Múltiples pantallas**: Abre autoplay.html en un monitor grande visible para todos

2. **Llamadas simultáneas**: Usa el "Retraso" para evitar que dos llamados suenen a la vez

3. **Diferentes idiomas**: Puedes cambiar idioma según la región del consultorio

4. **Volumen bajo**: Si el audio es débil, aumenta volumen del slider + sistema

5. **Test**: Usa botón "🔊 Prueba de Audio" para verificar funcionamiento

6. **Log en tiempo real**: El log muestra exactamente qué está pasando

7. **Estadísticas**: Ve cuántos llamados se han reproducido

---

## 🔄 Monitoreo vs Autoplay

### Monitor.js (Node.js)
- ✅ Funciona en terminal
- ✅ No requiere navegador
- ✅ Usa síntesis de voz del sistema
- ❌ Solo mostrará en terminal

### Autoplay.html (Navegador)
- ✅ Interfaz visual completa
- ✅ Configurable en tiempo real
- ✅ Múltiples idiomas
- ✅ Historial de eventos
- ❌ Requiere navegador

---

## 📊 Estadísticas

El sistema registra:
- Total de llamados
- Llamados reproducidos
- Última actualización
- Evento por evento en el log

---

## 🎯 Casos de Uso

1. **Consultorio médico**: Mostrar en pantalla pública + reproducir

2. **Centro de llamadas**: Integrar con sistema de citas existente

3. **Hospital**: Monitor en varias áreas simultáneamente

4. **Clínica**: Autoplay en cada consultorio

---

## 🔐 Seguridad

- El sistema usa CORS habilitado (cambiar si es necesario)
- Credenciales de Supabase en `.env`
- WebSocket local (localhost:8000)

---

## 📝 Próximas Mejoras

- [ ] Notificaciones por email
- [ ] Integración con sistemas PBX
- [ ] Grabación de llamadas
- [ ] Estadísticas avanzadas
- [ ] Múltiples consultorios

---

## 🎓 Cómo Funciona Internamente

1. **Server.js** monitorea Supabase con polling cada 1 segundo
2. Cuando detecta nuevo registro, hace broadcast por WebSocket
3. **Autoplay.html** recibe evento WebSocket
4. Muestra en pantalla y reproduce con síntesis de voz
5. Agrega a historial y actualiza estadísticas

---

**¡Sistema listo para usar!** 🎉

Abre autoplay.html y comienza a crear llamados desde index.html
