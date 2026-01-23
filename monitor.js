/**
 * MONITOR EN TIEMPO REAL DE SUPABASE
 * Monitorea la tabla 'llamados' y reproduce automáticamente los nuevos registros
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// Cliente Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

console.log('\n🎤 MONITOR DE LLAMADOS INICIADO');
console.log('================================\n');

/**
 * Reproducir texto con síntesis de voz (Windows)
 */
function reproducirTexto(texto) {
  try {
    // Escapar comillas para PowerShell
    const textoEscapado = texto.replace(/"/g, '`"');
    
    // Usar PowerShell para reproducción
    const psScript = `
      Add-Type -AssemblyName System.Speech
      $speak = New-Object System.Speech.Synthesis.SpeechSynthesizer
      $speak.Speak("${textoEscapado}")
    `;
    
    execSync(`powershell -Command "${psScript.replace(/"/g, '\\"')}"`, { 
      stdio: 'pipe',
      maxBuffer: 10 * 1024 * 1024
    });
    
    console.log('✅ Reproducido:', texto);
  } catch (error) {
    console.error('❌ Error reproduciendo:', error.message);
  }
}

/**
 * Monitorear cambios en la tabla llamados
 */
async function iniciarMonitor() {
  console.log('🔄 Conectando a Supabase...\n');

  try {
    // Obtener llamados existentes
    const { data: llamadosExistentes, error: errorExistentes } = await supabase
      .from('llamados')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (errorExistentes) {
      console.error('❌ Error obteniendo llamados:', errorExistentes);
      return;
    }

    const ultimoId = llamadosExistentes.length > 0 ? llamadosExistentes[0].id : 0;
    console.log(`✅ Conectado. Último ID: ${ultimoId}`);
    console.log('⏳ Esperando nuevos llamados...\n');

    // Usar polling para monitorear cambios (Supabase Realtime requiere suscripción)
    let ultimoIdMonitoreado = ultimoId;

    // Polling cada 2 segundos
    setInterval(async () => {
      try {
        const { data: nuevosCalls, error } = await supabase
          .from('llamados')
          .select('*')
          .gt('id', ultimoIdMonitoreado)
          .order('id', { ascending: true });

        if (error) {
          console.error('❌ Error consultando:', error.message);
          return;
        }

        if (nuevosCalls && nuevosCalls.length > 0) {
          nuevosCalls.forEach((llamado) => {
            if (llamado.id > ultimoIdMonitoreado) {
              ultimoIdMonitoreado = llamado.id;

              console.log('\n🔔 ¡NUEVO LLAMADO DETECTADO!');
              console.log(`   ID: ${llamado.id}`);
              console.log(`   Turno: ${llamado.turno_numero}`);
              console.log(`   Paciente: ${llamado.paciente_nombre}`);
              console.log(`   Consultorio: ${llamado.consultorio}`);
              console.log(`   Hora: ${new Date(llamado.created_at).toLocaleTimeString()}\n`);

              // Reproducir automáticamente
              reproducirTexto(llamado.texto_completo);

              console.log('');
            }
          });
        }
      } catch (error) {
        console.error('❌ Error en polling:', error.message);
      }
    }, 2000); // Monitorear cada 2 segundos

  } catch (error) {
    console.error('❌ Error inicializando monitor:', error);
  }
}

/**
 * Escuchar cambios con Supabase Realtime (Alternativa)
 */
async function iniciarMonitorRealtime() {
  console.log('🔄 Configurando Supabase Realtime...\n');

  try {
    // Obtener último ID
    const { data: ultimosCalls } = await supabase
      .from('llamados')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    const ultimoId = ultimosCalls?.[0]?.id || 0;

    console.log(`✅ Última ID: ${ultimoId}`);
    console.log('⏳ Monitoreando cambios en tiempo real...\n');

    // Suscribirse a cambios en la tabla
    supabase
      .channel('llamados-channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'llamados',
        },
        (payload) => {
          const llamado = payload.new;

          console.log('\n🔔 ¡NUEVO LLAMADO!');
          console.log(`   ID: ${llamado.id}`);
          console.log(`   Turno: ${llamado.turno_numero}`);
          console.log(`   Paciente: ${llamado.paciente_nombre}`);
          console.log(`   Consultorio: ${llamado.consultorio}`);
          console.log(`   Hora: ${new Date(llamado.created_at).toLocaleTimeString()}\n`);

          // Reproducir automáticamente
          reproducirTexto(llamado.texto_completo);

          console.log('');
        }
      )
      .subscribe();

    console.log('✅ Monitor activo\n');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Iniciar monitor
console.log('Opciones:');
console.log('1. Polling (más compatible)');
console.log('2. Realtime (mejor rendimiento)\n');

// Usar polling por defecto (más compatible)
iniciarMonitor();

// Capturar Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Monitor detenido');
  process.exit(0);
});
