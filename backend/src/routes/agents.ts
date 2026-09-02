import { Router } from 'express';
import { format, subHours } from 'date-fns';

const router = Router();
const now = new Date();

const agents = [
  { id: 'weather-agent', name: 'Weather Agent', description: 'Analyzes regional weather conditions and generates impact assessments', status: 'completed', lastRun: format(subHours(now, 0.1), "HH:mm:ss"), analysisCount: 1247, alertsGenerated: 23 },
  { id: 'forecast-agent', name: 'Generation Forecast Agent', description: 'Predicts solar/wind generation using weather data and historical patterns', status: 'completed', lastRun: format(subHours(now, 0.09), "HH:mm:ss"), analysisCount: 1244, alertsGenerated: 31 },
  { id: 'performance-agent', name: 'Asset Performance Agent', description: 'Continuously monitors asset performance and detects anomalies', status: 'warning', lastRun: format(subHours(now, 0.08), "HH:mm:ss"), analysisCount: 1241, alertsGenerated: 87 },
  { id: 'maintenance-agent', name: 'Predictive Maintenance Agent', description: 'Analyzes sensor data to predict equipment failures proactively', status: 'completed', lastRun: format(subHours(now, 0.07), "HH:mm:ss"), analysisCount: 1238, alertsGenerated: 52 },
  { id: 'grid-agent', name: 'Grid Optimization Agent', description: 'Manages grid integration and evaluates export/storage decisions', status: 'completed', lastRun: format(subHours(now, 0.06), "HH:mm:ss"), analysisCount: 1235, alertsGenerated: 19 },
  { id: 'dashboard-agent', name: 'Dashboard Agent', description: 'Orchestrates all agent outputs and provides unified recommendations', status: 'completed', lastRun: format(subHours(now, 0.05), "HH:mm:ss"), analysisCount: 1232, alertsGenerated: 142 },
];

router.get('/', (_req, res) => res.json(agents));
export default router;
