# ✅ CHECKLIST VISUAL - VERIFICACIÓN DEL SISTEMA

## 📋 ANTES DE COMENZAR

### ✅ Servidor Node.js

**Verificar:**
```bash
node --version
# Resultado esperado: v16.x.x o superior
```

**Si no está instalado:**
- Descarga de: https://nodejs.org/

### ✅ Dependencias instaladas

**Verificar:**
```bash
npm --version
# Resultado esperado: 7.x.x o superior
```

**Si falta instalar:**
```bash
cd c:\python\llamar_paciente_dra_reyes_v3
npm install
```

### ✅ Variables de entorno

**Verificar:**
```
Archivo: .env (debe existir)
Contenido:
SUPABASE_URL=...
SUPABASE_KEY=...
```

---

## 🚀 CHECKLIST DE INICIO

### 1. ✅ Servidor está corriendo

**En Terminal:**
```bash
cd c:\python\llamar_paciente_dra_reyes_v3
node server.js
```

**Deberías ver:**
```
🚀 Sistema de Llamados iniciado
📡 Servidor escuchando en puerto 8000
🌐 WebSocket: ws://localhost:8000
🏥 Consultorio: Dra. Reyes

📊 Iniciando monitor de Supabase...
✅ Monitor listo. Último ID: 7
```

**Status**: ☐ Visto  ☐ NO Visto → Problema

### 2. ✅ Health Check funciona

**En navegador o terminal:**
```bash
curl http://localhost:8000/api/health
```

**Deberías recibir:**
```
Status: 200 OK
{"status":"ok"}
```

**Status**: ☐ OK  ☐ Conexión rechazada → Problema

### 3. ✅ Autoplay abre correctamente

**URL:**
```
http://localhost:8000/autoplay.html
```

**Deberías ver:**
```
- Página carga sin errores
- Título: "Sistema de Autoplay"
- Indicador conexión: 🟢 CONECTADO (verde)
- Pantalla grande para números
- Controles de volumen/idioma
- Log de eventos vacío
- Botón [🔊 Prueba]
```

**Status**: ☐ OK  ☐ Página no carga → Problema

### 4. ✅ Panel de control funciona

**URL:**
```
http://localhost:8000/index.html
```

**Deberías ver:**
```
- Formulario con 3 campos:
  • Número de turno
  • Nombre del paciente
  • Número de consultorio
- Botón [CREAR LLAMADO]
- Lista de llamados anteriores
```

**Status**: ☐ OK  ☐ Página no carga → Problema

### 5. ✅ Audio de prueba funciona

**Acción:**
```
En autoplay.html:
Haz clic en [🔊 Prueba]
```

**Deberías escuchar:**
```
Voz: "Prueba de audio número 1"
```

**Nota**: Si no escuchas
- Verifica volumen del navegador (esquina superior)
- Verifica volumen del sistema (Windows)
- Intenta en Firefox si usas Chrome

**Status**: ☐ Escuché  ☐ Sin sonido → Revisar volumen

### 6. ✅ Crear llamado funciona

**Acción:**
```
En index.html:
1. Turno: 100
2. Paciente: TEST USER
3. Consultorio: 5
Clic en [CREAR LLAMADO]
```

**Deberías ver:**
```
- Confirmación de creación
- Llamado aparece en lista
- Mensaje de éxito
```

**Status**: ☐ Creado  ☐ Error → Revisar consola

### 7. ✅ Reproducción automática

**Acción:**
```
Después de crear llamado en Paso 6
```

**Deberías ver en autoplay.html:**
```
- Pantalla muestra:
  100
  TEST USER
  Consultorio 5
  
- Escuchas:
  "Turno número 100, TEST USER, 
   favor pasar al consultorio 5"
   
- Log muestra evento:
  [HH:MM:SS] 🔊 Reproduciendo: Turno 100 - TEST USER
```

**Status**: ☐ Reproducido  ☐ No ocurrió → Revisar conexión

---

## 🎛️ CHECKLIST DE CONFIGURACIÓN

### Volumen

**Verificar:**
```
☐ Barra de volumen visible en autoplay
☐ Está en máximo (100%)
☐ Si aún está bajo, verifica volumen Windows
☐ Sistema operativo volumen: 100%
☐ Navegador no tiene audio muteo
```

### Idioma

**Verificar:**
```
☐ Selector de idioma visible
☐ Español (España) seleccionado por defecto
☐ Puedes cambiar a otras opciones
☐ Cambio aplica inmediatamente
```

### Velocidad de voz

**Verificar:**
```
☐ Selector de velocidad visible
☐ 1x seleccionado (velocidad normal)
☐ Puedes cambiar a 0.5x, 1.5x, 2x
☐ Cambio se aplica en próxima reproducción
```

### Retraso

**Verificar:**
```
☐ Campo de retraso visible
☐ Muestra milisegundos (0-5000)
☐ Defecto: 500ms
☐ Aumentar si dos llamados se solapan
```

---

## 🔌 CHECKLIST DE CONECTIVIDAD

### WebSocket

**Verificar:**
```
☐ Indicador en autoplay es 🟢 verde
☐ Dice "CONECTADO"
☐ No hay errores en Console (F12)
☐ Reconecta automáticamente si cae
```

**Abrir Console:**
```
Presiona F12 → pestaña Console
Deberías VER:
- Mensajes de conexión WebSocket
- NO deberías ver errores rojo

Si hay errores rojo:
- Verifica que localhost:8000 es accesible
- Verifica que server.js está corriendo
```

### Supabase

**Verificar:**
```
☐ Server muestra: "✅ Monitor listo"
☐ Obtiene último ID de la tabla
☐ API retorna datos cuando consultas
☐ .env tiene credenciales correctas
```

**Test:**
```bash
curl http://localhost:8000/api/llamados
# Deberías recibir JSON con llamados
```

---

## 🆘 CHECKLIST DE TROUBLESHOOTING

### Problema: "Sin sonido en autoplay"

**Verificar:**
```
☐ Barra volumen autoplay en máximo
☐ Volumen Windows en máximo
☐ Navegador permite audio (F12 → permisos)
☐ Botón [🔊 Prueba] reproduce sonido
☐ Seleccionaste idioma con voces disponibles
☐ Sistema operativo tiene voces de sintetizador
```

**Solución:**
```
1. Aumenta volumen autoplay a 100%
2. Aumenta volumen Windows a 100%
3. Abre F12 → Permisos → Permite audio
4. Intenta otro idioma
5. Reinicia navegador
```

### Problema: "Autoplay no detecta nuevos llamados"

**Verificar:**
```
☐ Indicador conexión es 🟢 verde
☐ No hay errores en F12 → Console
☐ Server está corriendo (ver terminal)
☐ Supabase está accesible
☐ .env tiene credenciales correctas
```

**Solución:**
```
1. Abre F12 → Console
2. Busca errores rojo (WebSocket, Network)
3. Verifica terminal servidor: "Monitor listo"
4. Reinicia servidor: node server.js
5. Recarga autoplay.html (F5)
```

### Problema: "Página no carga"

**Verificar:**
```
☐ Escribiste correctamente: http://localhost:8000/autoplay.html
☐ Servidor está corriendo
☐ No hay typo en URL
☐ Puerto 8000 no está en uso por otra aplicación
```

**Solución:**
```
1. Verifica URL exacta en navegador
2. Recarga: F5 o Ctrl+R
3. Verifica terminal: "Servidor escuchando en puerto 8000"
4. Si error EADDRINUSE: cambia puerto en .env o server.js
5. Reinicia servidor
```

### Problema: "Crear llamado da error"

**Verificar:**
```
☐ Llenaste todos los campos
☐ Los datos son válidos (números en números)
☐ Supabase está accesible
☐ No hay errores en F12 → Network
```

**Solución:**
```
1. Completa todos los campos
2. Usa números válidos para turno y consultorio
3. Abre F12 → Network tab
4. Intenta crear de nuevo
5. Busca error en respuesta HTTP
```

---

## 📊 CHECKLIST FINAL

### Antes de considerar "Listo":

```
SERVIDOR:
☐ Terminal muestra: "Servidor escuchando en puerto 8000"
☐ Terminal muestra: "Monitor listo"
☐ Health check retorna 200 OK

AUTOPLAY:
☐ Página carga en: http://localhost:8000/autoplay.html
☐ Indicador conectado (🟢 verde)
☐ Todos los controles visibles
☐ Botón [🔊 Prueba] reproduce sonido

PANEL:
☐ Página carga en: http://localhost:8000/index.html
☐ Puedes llenar formulario
☐ Botón [CREAR LLAMADO] funciona

REPRODUCCIÓN:
☐ Crear llamado en panel
☐ Autoplay detecta automáticamente
☐ Número aparece en pantalla grande
☐ Voz se reproduce automáticamente
☐ Log muestra el evento

CONFIGURACIÓN:
☐ Volumen ajustable
☐ Idioma cambiable
☐ Velocidad configurable
☐ Retraso modifiable
```

---

## 🎯 SEGÚN RESULTADO

### TODO ESTÁ ✅

```
Felicidades! Tu sistema está 100% funcional.

Próximos pasos:
1. Abre autoplay.html
2. Comienza a crear llamados
3. Disfruta la reproducción automática

Opcional:
- Personaliza idioma/volumen
- Integra con tu sistema
- Despliega a producción
```

### HAY ⚠️ PROBLEMAS

```
Problemas comunes:
1. Sin sonido → Revisa volumen (barra + Windows)
2. No detecta → Abre F12 Console, busca errores
3. Página no carga → Verifica URL exacta
4. Servidor no corre → Terminal: node server.js

Si persiste:
→ Abre GUIA_VISUAL.md sección "Troubleshooting"
→ Busca tu problema específico
→ Sigue soluciones paso a paso
```

---

## 📋 PLANTILLA PARA REPORTE

Si tienes problema, verifica:

```
Sistema:
- Windows: Sí ☐ No ☐
- Navegador: Chrome ☐ Firefox ☐ Edge ☐
- Node version: ________

Errores:
- Servidor: ________________
- Consola: ________________
- Network: ________________

Pasos que hiciste:
1. ________________
2. ________________
3. ________________

Qué esperabas:
________________

Qué pasó en cambio:
________________
```

---

## ✅ CONFIRMACIÓN FINAL

### Mi sistema está listo cuando:

```
✅ Abro autoplay.html → Página carga
✅ Indicador dice: CONECTADO (verde)
✅ Clic en [🔊 Prueba] → Escucho voz
✅ Creo llamado en index.html → Se crea exitosamente
✅ Autoplay detecta → Número aparece en pantalla
✅ Voz se reproduce → "Turno X, Nombre, Consultorio Y"
✅ Todo automático → Sin hacer clic nada más

Entonces: ¡SISTEMA LISTO! 🎉
```

---

**Checklist Visual - Verificación Completa**  
**Estado**: ✅ Completado  
**Última actualización**: Diciembre 2024

---

## 🎊 ¡LISTO PARA COMENZAR!

Si pasaste todos los checks:
```
→ Abre: http://localhost:8000/autoplay.html
→ Disfruta del sistema
→ ¡Éxito!
```

Si tienes dudas:
```
→ Lee: GUIA_VISUAL.md
→ Busca tu problema
→ Sigue soluciones
```
