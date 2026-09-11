import { EventEmitter } from 'events';

// Singleton event bus — simulator ticks → SSE route broadcasts
const sseEmitter = new EventEmitter();
sseEmitter.setMaxListeners(100); // allow many concurrent SSE clients

export default sseEmitter;
