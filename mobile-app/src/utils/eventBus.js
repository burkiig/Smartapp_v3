/**
 * Hafif event bus — singleton.
 * apiAdapter → app katmanına yan kanal iletişimi için kullanılır.
 * Örnek: 401 Unauthorized → FORCE_LOGOUT event'i.
 */
const listeners = {};

const eventBus = {
  on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
    return () => this.off(event, fn);
  },
  off(event, fn) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(f => f !== fn);
  },
  emit(event, ...args) {
    (listeners[event] || []).forEach(fn => fn(...args));
  },
};

export default eventBus;
