/**
 * Cliente WebSocket para conectarse al sistema de llamados
 * Uso en navegador o cliente Node.js
 */

class LlamadosClient {
  constructor(url = 'ws://localhost:8000') {
    this.url = url;
    this.ws = null;
    this.reconnectInterval = 3000;
    this.listeners = {};
  }

  /**
   * Conectar al servidor WebSocket
   */
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('✅ Conectado al servidor de llamados');
          this.emit('connected');
          resolve();
        };

        this.ws.onmessage = (event) => {
          const message = JSON.parse(event.data);
          console.log('📨 Mensaje recibido:', message);
          this.emit(message.type, message);
        };

        this.ws.onerror = (error) => {
          console.error('❌ Error WebSocket:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('🔌 Desconectado del servidor');
          this.emit('disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Intentar reconectar
   */
  attemptReconnect() {
    console.log(`🔄 Intentando reconectar en ${this.reconnectInterval}ms...`);
    setTimeout(() => {
      this.connect().catch(() => {
        this.attemptReconnect();
      });
    }, this.reconnectInterval);
  }

  /**
   * Desconectar
   */
  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }

  /**
   * Enviar ping
   */
  ping() {
    this.send({
      type: 'ping'
    });
  }

  /**
   * Reportar que se está reproduciendo un llamado
   */
  reportarReproduccion(id) {
    this.send({
      type: 'reproducir',
      id
    });
  }

  /**
   * Enviar mensaje personalizado
   */
  send(message) {
    if (this.ws && this.ws.readyState === 1) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket no está conectado');
    }
  }

  /**
   * Escuchar eventos
   */
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  /**
   * Emit eventos
   */
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => {
        callback(data);
      });
    }
  }
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LlamadosClient;
}
