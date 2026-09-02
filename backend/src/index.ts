import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import assetsRouter from './routes/assets';
import weatherRouter from './routes/weather';
import generationRouter from './routes/generation';
import maintenanceRouter from './routes/maintenance';
import gridRouter from './routes/grid';
import alertsRouter from './routes/alerts';
import agentsRouter from './routes/agents';
import aiRouter from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Allow localhost dev + any GitHub Pages deploy + Render preview URLs
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  /\.github\.io$/,
  /\.onrender\.com$/,
  /\.vercel\.app$/,
];
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      typeof o === 'string' ? o === origin : o.test(origin)
    );
    callback(null, allowed);
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'GreenPulse AI Backend',
    ibmAI: process.env.IBM_API_KEY ? 'connected' : 'mock-mode',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/assets', assetsRouter);
app.use('/api/weather', weatherRouter);
app.use('/api/generation', generationRouter);
app.use('/api/maintenance', maintenanceRouter);
app.use('/api/grid', gridRouter);
app.use('/api/alerts', alertsRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/ai', aiRouter);

app.listen(PORT, () => {
  console.log(`\n🌿 GreenPulse AI Backend running on http://localhost:${PORT}`);
  console.log(`   IBM AI Mode: ${process.env.IBM_API_KEY ? '✅ Granite LLM Connected' : '🔶 Mock Mode (no IBM_API_KEY)'}`);
  console.log(`   Data: Prototype demo data — Kutch & Banaskantha, Gujarat\n`);
});

export default app;
