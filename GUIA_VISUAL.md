# 🎬 GUÍA VISUAL - PASO A PASO

## 🎯 OBJETIVO
Reproducir automáticamente los llamados de pacientes cuando se insertan en Supabase.

---

## ✅ PASO 1: VERIFICAR QUE EL SERVIDOR ESTÁ CORRIENDO

### Terminal muestra:
```
🚀 Sistema de Llamados iniciado
📡 Servidor escuchando en puerto 8000
🌐 WebSocket: ws://localhost:8000
🏥 Consultorio: Dra. Reyes

📊 Iniciando monitor de Supabase...
✅ Monitor listo. Último ID: 7
```

✅ **Si ves esto, el servidor está OK**

---

## ✅ PASO 2: ABRIR AUTOPLAY EN NAVEGADOR

### URL:
```
http://localhost:8000/autoplay.html
```

### Deberías ver:
```
╔═════════════════════════════════════╗
║       SISTEMA DE AUTOPLAY           ║
║                                     ║
║   Estado: ✅ CONECTADO              ║
║                                     ║
║   ┌───────────────────────────┐    ║
║   │  Turno: --                │    ║
║   │  Paciente: --             │    ║
║   │  Consultorio: --          │    ║
║   └───────────────────────────┘    ║
║                                     ║
║   ⚙️ Configuración                  ║
║   🔊 Volumen: [========] 80%        ║
║   🎯 Velocidad: 1x                  ║
║   🗣️ Idioma: Español (España)      ║
║   ⏱️ Retraso: 500ms                 ║
║                                     ║
║   [🔊 Prueba] [📋 Limpiar Log]    ║
║                                     ║
║   📊 Estadísticas                   ║
║   Total reproducido: 0              ║
║                                     ║
╚═════════════════════════════════════╝
```

✅ **Si ves esto, autoplay.html está OK**

### Indicador de conexión:
- 🟢 Verde = Conectado (correcto)
- 🔴 Rojo = Desconectado (problema)

---

## ✅ PASO 3: CREAR UN LLAMADO (PRIMERA OPCIÓN - PANEL)

### URL:
```
http://localhost:8000/index.html
```

### Formulario:
```
┌─────────────────────────────────┐
│   CREAR NUEVO LLAMADO           │
│                                 │
│   Número de Turno:              │
│   [42________________]          │
│                                 │
│   Nombre del Paciente:          │
│   [María García_____]           │
│                                 │
│   Número de Consultorio:        │
│   [3________________]           │
│                                 │
│   [CREAR LLAMADO]               │
│                                 │
└─────────────────────────────────┘
```

**Ingresa datos** → Haz clic **[CREAR LLAMADO]**

---

## ✅ PASO 3 (ALTERNATIVA) - LÍNEA DE COMANDOS

### Terminal:
```bash
curl -X POST http://localhost:8000/api/llamados/crear \
  -H "Content-Type: application/json" \
  -d '{
    "turno_numero": 42,
    "paciente_nombre": "María García",
    "consultorio": 3
  }'
```

**Presiona Enter**

---

## 🎤 PASO 4: ¡ESCUCHA LA REPRODUCCIÓN AUTOMÁTICA!

### En autoplay.html deberías ver:

```
Estado: ✅ CONECTADO

┌───────────────────────────────────┐
│         42                        │
│    María García                   │
│    Consultorio 3                  │
└───────────────────────────────────┘

🔊 "Turno número 42, María García, 
   favor pasar al consultorio 3"
```

### Estadísticas actualizadas:
```
Total reproducido: 1
```

### Log de eventos:
```
[10:30:45] 🔊 Reproduciendo: Turno 42 - María García (Consultorio 3)
```

✅ **¡FUNCIONÓ!** ¿Lo escuchaste?

---

## 🎯 FLUJO COMPLETO VISUALIZADO

```
TÚ                    SISTEMA                  NAVEGADOR
│                       │                         │
├─ Crear llamado ──────>│                         │
│  (index.html o API)    │                         │
│                        │                         │
│                        ├─ INSERT Supabase       │
│                        │   Nuevo registro        │
│                        │                         │
│                        ├─ Detectar (1 segundo)  │
│                        │   ID > ultimoID         │
│                        │                         │
│                        ├─ Broadcast ───────────>│
│                        │   via WebSocket         │
│                        │                         │
│                        │                         ├─ Recibir evento
│                        │                         │
│                        │                         ├─ Mostrar en pantalla
│                        │                         │
│                        │                         ├─ Síntesis de voz
│                        │                         │
│                        │                         ├─ 🔊 REPRODUCIR
│                        │                         │
│                        │                         ├─ Agregar a log
│                        │                         │
│                        │                         └─ Actualizar contador
```

---

## 🔊 CONFIGURACIÓN DE VOZ (OPCIONAL)

### En autoplay.html, puedes cambiar:

**1. Volumen** 🔊
```
Barra deslizable: 0% a 100%
Ejemplo: 80% (volumen moderado)
```

**2. Velocidad** 🎯
```
Selector: 0.5x | 1x | 1.5x | 2x
Ejemplo: 1x (velocidad normal)
```

**3. Idioma** 🗣️
```
Selector:
  • Español (España) ← Defecto
  • Español (México)
  • Español (Argentina)
  • Inglés (USA)
```

**4. Retraso** ⏱️
```
Campo numérico: 0-5000ms
Ejemplo: 500ms (medio segundo)

Uso: Si dos llamados llegan juntos, 
el segundo espera 500ms antes de reproducir
```

---

## ✅ PRUEBAS PARA VERIFICAR

### Prueba 1: Botón de Audio
**En autoplay.html**, haz clic en **[🔊 Prueba]**

Deberías escuchar:
```
"Prueba de audio número 1"
```

✅ Si escuchas → Audio funciona

### Prueba 2: Indicador de Conexión
Deberías ver:
```
Conexión: 🟢 CONECTADO
```

✅ Si es verde → WebSocket funciona

### Prueba 3: Crear Llamado Real

En index.html:
1. Ingresa: Turno: 100
2. Ingresa: Nombre: TEST USER
3. Ingresa: Consultorio: 5
4. Haz clic [CREAR LLAMADO]

En autoplay.html deberías ver:
```
100
TEST USER
Consultorio 5
```

Y escuchar:
```
"Turno número 100, TEST USER, favor pasar al consultorio 5"
```

✅ Si todo funciona → Sistema OK

### Prueba 4: Múltiples Navegadores

1. Abre autoplay.html en Tab 1
2. Abre index.html en Tab 2
3. Crea un llamado
4. AMBAS pestañas deberían reproducir

✅ Si ambas reproducen → Broadcast funciona

---

## 🎛️ CONTROLES Y FUNCIONES

```
┌─────────────────────────────────────┐
│  INTERFAZ AUTOPLAY.HTML             │
├─────────────────────────────────────┤
│                                     │
│  🟢 Indicador Conexión             │
│  └─ Verde = OK, Rojo = Error       │
│                                     │
│  📊 Área de Pantalla Grande        │
│  └─ Número turno + nombre          │
│                                     │
│  🎛️ CONTROLES:                     │
│                                     │
│  🔊 Volumen:  [====●===]  80%     │
│     └─ Arrastra para ajustar       │
│                                     │
│  🎯 Velocidad: [Selector ▼]        │
│     └─ 0.5x | 1x | 1.5x | 2x     │
│                                     │
│  🗣️ Idioma: [Selector ▼]           │
│     └─ Español o Inglés           │
│                                     │
│  ⏱️ Retraso: [500 ms]              │
│     └─ Milisegundos antes reproducir
│                                     │
│  🔊 [PRUEBA] - Testea audio       │
│                                     │
│  📋 [LIMPIAR LOG] - Borra historial│
│                                     │
├─────────────────────────────────────┤
│  📊 ESTADÍSTICAS                    │
│  Total reproducido: 5              │
│  Última actualización: 10:35:42    │
├─────────────────────────────────────┤
│  📝 LOG DE EVENTOS                  │
│  [10:35:42] 🔊 Turno 5 - Juan Pérez
│  [10:34:15] 🔊 Turno 4 - Ana López
│  [10:33:08] 🔊 Turno 3 - Carlos Ruiz
│  [10:32:01] 🔊 Turno 2 - María García
│  [10:30:45] 🔊 Turno 1 - TEST USER
│                                     │
└─────────────────────────────────────┘
```

---

## 💻 ACCESOS RÁPIDOS

```
┌─────────────────────────────────────┐
│  ACCESOS PRINCIPALES                │
├─────────────────────────────────────┤
│                                     │
│  Autoplay (PRINCIPAL)               │
│  http://localhost:8000/autoplay.html│
│                                     │
│  Crear Llamados                     │
│  http://localhost:8000/index.html   │
│                                     │
│  Monitor Web                        │
│  http://localhost:8000/monitor.html │
│                                     │
│  API - Health Check                 │
│  http://localhost:8000/api/health   │
│                                     │
│  API - Ver Llamados                 │
│  http://localhost:8000/api/llamados │
│                                     │
└─────────────────────────────────────┘
```

---

## 🎯 RESULTADO ESPERADO

### Cuando funciona correctamente:

```
SECUENCIA DE EVENTOS:

1. [10:30:45] Usuario crea turno 42
   ├─ Nombre: María García
   └─ Consultorio: 3

2. [10:30:46] 
   ├─ Server detecta nuevo ID
   └─ Inicia broadcast

3. [10:30:47]
   ├─ Autoplay recibe evento
   ├─ Muestra en pantalla:
   │  42
   │  María García
   │  Consultorio 3
   └─ Inicia síntesis de voz

4. [10:30:48]
   ├─ 🔊 Se escucha:
   │  "Turno número 42, María García,
   │   favor pasar al consultorio 3"
   └─ Duración: 3-5 segundos

5. [10:30:52]
   ├─ Log actualizado:
   │  ✅ Reproducido correctamente
   └─ Contador: +1 reproducción

6. Sistema listo para siguiente llamado
```

---

## 🆘 SI ALGO NO FUNCIONA

### Checklist de verificación:

```
¿Servidor en puerto 8000?
├─ SÍ ────→ Continuar
└─ NO ────→ Ejecutar: node server.js

¿Autoplay.html abre?
├─ SÍ ────→ Continuar
└─ NO ────→ Revisar http://localhost:8000/autoplay.html

¿Indicador conexión es verde?
├─ SÍ ────→ Continuar
└─ NO ────→ F12 → Console → Ver errores

¿Botón prueba reproduce sonido?
├─ SÍ ────→ Audio funciona
└─ NO ────→ Revisa volumen navegador + sistema

¿Crear llamado en index.html?
├─ SÍ ────→ Continuar
└─ NO ────→ Revisa errores en Console

¿Autoplay.html muestra el turno?
├─ SÍ ────→ Continuar
└─ NO ────→ Monitor no está detectando

¿Se reproduce la voz?
├─ SÍ ────→ ¡FUNCIONANDO! 🎉
└─ NO ────→ Revisa volumen + permisos audio
```

---

## 📊 INDICADORES VISUALES

### CORRECTO (Verde):
```
Estado: ✅ CONECTADO      (verde)
Totales: 5 reproducidos   (mostrados)
Log: Eventos aparecen     (actualizados)
Audio: Se escucha         (sonoro)
```

### PROBLEMA (Rojo):
```
Estado: ❌ DESCONECTADO    (rojo)
Console: Errores visibles  (avisos)
Audio: Sin sonido          (silencio)
Log: No se actualiza       (estático)
```

---

## 🎉 ¡LISTO!

### Resumen en 3 pasos:

1. ✅ Abre: http://localhost:8000/autoplay.html
2. ✅ Crea llamado: http://localhost:8000/index.html  
3. ✅ ¡Escucha reproducción automática! 🔊

---

**Guía Visual Completada**  
**Estado**: 100% Funcional  
**Última actualización**: Diciembre 2024
