/**
 * EJEMPLO DE USO - REST API
 * Ejemplos de cómo usar los endpoints REST del sistema
 */

const API_URL = 'http://localhost:8000';

/**
 * 1. Verificar estado del servidor
 */
async function healthCheck() {
  console.log('\n1️⃣  HEALTH CHECK\n');
  try {
    const response = await fetch(`${API_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Estado:', data);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 2. Obtener últimos 5 llamados
 */
async function getLastCalls() {
  console.log('\n2️⃣  ÚLTIMOS LLAMADOS\n');
  try {
    const response = await fetch(`${API_URL}/api/llamados?limit=5`);
    const data = await response.json();
    console.log('✅ Llamados:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 3. Obtener primer llamado pendiente
 */
async function getPending() {
  console.log('\n3️⃣  LLAMADOS PENDIENTES\n');
  try {
    const response = await fetch(`${API_URL}/api/llamados/pendientes`);
    const data = await response.json();
    if (data.data) {
      console.log('✅ Pendiente:', JSON.stringify(data.data, null, 2));
    } else {
      console.log('✅ No hay llamados pendientes');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 4. Crear nuevo llamado
 */
async function createCall(turno, paciente, consultorio) {
  console.log(`\n4️⃣  CREAR LLAMADO\n`);
  try {
    const response = await fetch(`${API_URL}/api/llamados/crear`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        turno_numero: turno,
        paciente_nombre: paciente,
        consultorio: consultorio
      })
    });
    const data = await response.json();
    console.log('✅ Llamado creado:', JSON.stringify(data, null, 2));
    return data.data?.[0]?.id;
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * 5. Marcar llamado como reproducido
 */
async function markAsReproduced(id) {
  console.log(`\n5️⃣  MARCAR COMO REPRODUCIDO (ID: ${id})\n`);
  try {
    const response = await fetch(`${API_URL}/api/llamados/${id}/reproducido`, {
      method: 'POST'
    });
    const data = await response.json();
    console.log('✅ Actualizado:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

/**
 * Ejecutar todo
 */
async function runAll() {
  console.log('='.repeat(50));
  console.log('EJEMPLOS DE REST API - SISTEMA DE LLAMADOS');
  console.log('='.repeat(50));

  await healthCheck();
  await getLastCalls();
  await getPending();

  const id = await createCall(42, 'María García', 2);
  
  if (id) {
    await new Promise(r => setTimeout(r, 1000));
    await markAsReproduced(id);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Ejemplos completados');
  console.log('='.repeat(50) + '\n');
}

// Ejecutar
runAll().catch(console.error);
