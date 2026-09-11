// ─── SSE Stream Route ─────────────────────────────────────────────────────────
// GET /api/stream
//
// Opens a persistent Server-Sent Events connection. The client receives:
//   - "snapshot" event immediately on connect (current full state)
//   - "tick"     event every 3 seconds as the simulator (or Kafka consumer) updates
//
// Frontend usage:
//   const es = new EventSource('/api/stream');
//   es.addEventListener('tick', e => {
//     const state = JSON.parse(e.data);
//     setAssets(state.assets);
//     setGrid(state.grid);
//   });
//   return () => es.close();

import { Router } from 'express';
import sseEmitter from '../data/simulator/sseEmitter';
import { getLiveState, DATA_SOURCE } from '../data/dataSourceAdapter';

const router = Router();

router.get('/', (req, res) => {
  // SSE headers
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // nginx: disable buffering
  res.flushHeaders();

  // Helper to write one SSE event
  const send = (event: string, data: unknown) => {
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  // 1. Send full current state immediately on connect
  send('snapshot', { ...getLiveState(), dataSource: DATA_SOURCE });

  // 2. Subscribe to simulator ticks (or Kafka messages in ibm-live mode)
  const onTick = (state: unknown) => {
    if (!res.writableEnded) send('tick', state);
  };

  sseEmitter.on('tick', onTick);

  // 3. Clean up when client disconnects
  req.on('close', () => {
    sseEmitter.off('tick', onTick);
  });
});

export default router;
