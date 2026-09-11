import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import assetsRouter     from './routes/assets';
import weatherRouter    from './routes/weather';
import generationRouter from './routes/generation';
import maintenanceRouter from './routes/maintenance';
import gridRouter       from './routes/grid';
import alertsRouter     from './routes/alerts';
import agentsRouter     from './routes/agents';
import aiRouter         from './routes/ai';
import streamRouter     from './routes/stream';
import { startDataSource, DATA_SOURCE } from './data/dataSourceAdapter';

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  /\.github\.io$/,
  /\.vercel\.app$/,
  /\.ibmappdomain\.com$/,
  /\.codeengine\.appdomain\.cloud$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    callback(null, allowed);
  },
  credentials: true,
}));

app.use(express.json());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'GreenPulse AI Backend',
    dataSource: DATA_SOURCE,
    ibmAI: process.env.IBM_API_KEY ? 'connected' : 'mock-mode',
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/assets',      assetsRouter);
app.use('/api/weather',     weatherRouter);
app.use('/api/generation',  generationRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/grid',        gridRouter);
app.use('/api/alerts',      alertsRouter);
app.use('/api/agents',      agentsRouter);
app.use('/api/ai',          aiRouter);
app.use('/api/stream',      streamRouter);   // ← SSE live stream

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`\n🌿 GreenPulse AI Backend  →  http://localhost:${PORT}`);
  console.log(`   Data Source : ${DATA_SOURCE === 'ibm-live' ? '☁️  IBM Cloud (live)' : '🔄 SCADA Simulator'}`);
  console.log(`   IBM AI      : ${process.env.IBM_API_KEY ? '✅ Granite LLM connected' : '🔶 Mock mode (no IBM_API_KEY)'}`);
  console.log(`   SSE Stream  : http://localhost:${PORT}/api/stream`);
  console.log(`   Region      : Kutch & Banaskantha, Gujarat\n`);

  await startDataSource();
});

export default app;
