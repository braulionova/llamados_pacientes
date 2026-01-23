/**
 * EJEMPLO DE USO - Cliente WebSocket en Node.js
 * Este archivo muestra cómo usar el sistema desde un cliente Node.js
 */

import LlamadosClient from './client.js';

// Crear cliente
const client = new LlamadosClient('ws://localhost:8000');

// Configurar listeners
client.on('connected', () => {
  console.log('\n🟢 Conectado al servidor de llamados\n');
  
  // Enviar ping cada 30 segundos para mantener conexión viva
  setInterval(() => client.ping(), 30000);
});

client.on('nuevo_llamado', (message) => {
  const { data } = message;
  console.log('\n📣 ¡NUEVO LLAMADO RECIBIDO!');
  console.log(`   Turno: ${data.turno_numero}`);
  console.log(`   Paciente: ${data.paciente_nombre}`);
  console.log(`   Consultorio: ${data.consultorio}`);
  console.log(`   Texto: ${data.texto_completo}\n`);
});

client.on('llamado_reproducido', (message) => {
  console.log(`\n🔊 Llamado ${message.id} ha sido reproducido\n`);
});

client.on('llamado_reproduciendo', (message) => {
  console.log(`\n🎵 Se está reproduciendo el llamado ${message.id}\n`);
});

client.on('pong', (message) => {
  console.log('🏓 Pong recibido');
});

client.on('disconnected', () => {
  console.log('\n🔌 Desconectado del servidor\n');
});

// Conectar
async function start() {
  console.log('🔄 Conectando al servidor...');
  try {
    await client.connect();
    console.log('✅ Conexión establecida');
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
  }
}

// Iniciar
start();

// Salir gracefully
process.on('SIGINT', () => {
  console.log('\n👋 Desconectando...');
  client.disconnect();
  process.exit(0);
});
