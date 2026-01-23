/**
 * Cliente Node.js para probar el sistema de llamados
 * Pruebas REST y WebSocket
 */

import fetch from 'node-fetch';
import LlamadosClient from './client.js';

const API_URL = 'http://localhost:8000';

/**
 * Pruebas REST
 */
async function testREST() {
  console.log('\n=== PRUEBAS REST ===\n');

  try {
    // Health check
    console.log('1️⃣  Health Check...');
    const healthRes = await fetch(`${API_URL}/api/health`);
    console.log('✅', await healthRes.json());

    // Obtener llamados
    console.log('\n2️⃣  Obtener últimos llamados...');
    const llamadosRes = await fetch(`${API_URL}/api/llamados?limit=5`);
    console.log('✅', await llamadosRes.json());

    // Obtener pendientes
    console.log('\n3️⃣  Obtener llamados pendientes...');
    const pendientesRes = await fetch(`${API_URL}/api/llamados/pendientes`);
    console.log('✅', await pendientesRes.json());

    // Crear llamado
    console.log('\n4️⃣  Crear nuevo llamado...');
    const createRes = await fetch(`${API_URL}/api/llamados/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turno_numero: 15,
        paciente_nombre: 'Juan Pérez',
        consultorio: 3
      })
    });
    const newLlamado = await createRes.json();
    console.log('✅', newLlamado);

    // Marcar como reproducido
    if (newLlamado.data && newLlamado.data[0]) {
      console.log('\n5️⃣  Marcar como reproducido...');
      const id = newLlamado.data[0].id;
      const markRes = await fetch(`${API_URL}/api/llamados/${id}/reproducido`, {
        method: 'POST'
      });
      console.log('✅', await markRes.json());
    }
  } catch (error) {
    console.error('❌ Error en pruebas REST:', error);
  }
}

/**
 * Pruebas WebSocket
 */
async function testWebSocket() {
  console.log('\n=== PRUEBAS WEBSOCKET ===\n');

  const client = new LlamadosClient();

  // Listeners
  client.on('connected', () => {
    console.log('🟢 Conectado');
  });

  client.on('nuevo_llamado', (message) => {
    console.log('📣 Nuevo llamado recibido:', message);
  });

  client.on('llamado_reproducido', (message) => {
    console.log('🔊 Llamado reproducido:', message);
  });

  client.on('llamado_reproduciendo', (message) => {
    console.log('🎵 Reproduciendo:', message);
  });

  client.on('pong', (message) => {
    console.log('🏓 Pong:', message);
  });

  try {
    await client.connect();

    // Enviar ping
    console.log('\n📤 Enviando ping...');
    client.ping();

    // Esperar a recibir eventos
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Reportar reproducción
    console.log('\n📤 Reportando reproducción...');
    client.reportarReproduccion(1);

    await new Promise(resolve => setTimeout(resolve, 2000));

    client.disconnect();
  } catch (error) {
    console.error('❌ Error en pruebas WebSocket:', error);
  }
}

/**
 * Ejecutar todas las pruebas
 */
async function runAllTests() {
  console.log('🧪 INICIANDO PRUEBAS DEL SISTEMA DE LLAMADOS');
  console.log('==========================================\n');

  // Esperar a que el servidor esté listo
  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    await testREST();
  } catch (error) {
    console.error('Error en REST:', error);
  }

  await new Promise(resolve => setTimeout(resolve, 1000));

  try {
    await testWebSocket();
  } catch (error) {
    console.error('Error en WebSocket:', error);
  }

  console.log('\n✅ Pruebas completadas');
}

// Ejecutar si se llama directamente
runAllTests().catch(console.error);
