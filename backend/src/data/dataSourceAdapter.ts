// ─── Data Source Adapter ─────────────────────────────────────────────────────
// THE SWITCH: set DATA_SOURCE in .env to change where data comes from.
//
//   DATA_SOURCE=simulator   → SCADA simulator (default, works offline, no credentials)
//   DATA_SOURCE=ibm-live    → IBM Cloud Event Streams + Open-Meteo + PostgreSQL
//
// All routes import from this adapter. They never reference simulator/ or live/
// directly. The data shape is identical regardless of source.

import { subHours, addHours } from 'date-fns';
import { liveState } from './simulator/liveAssetState';

export const DATA_SOURCE = (process.env.DATA_SOURCE ?? 'simulator') as 'simulator' | 'ibm-live';

// ─── Start the chosen data source ────────────────────────────────────────────
export async function startDataSource(): Promise<void> {
  if (DATA_SOURCE === 'ibm-live') {
    const { startIbmLiveSource } = await import('./live/ibmLiveSource');
    await startIbmLiveSource();
  } else {
    const { startSimulator } = await import('./simulator/scadaSimulator');
    startSimulator();
  }
}

// ─── Assets ──────────────────────────────────────────────────────────────────
export function getAssets() {
  return liveState.assets;
}

export function getAssetById(id: string) {
  return liveState.assets.find(a => a.assetId === id) ?? null;
}

// ─── Weather ──────────────────────────────────────────────────────────────────
export function getCurrentWeather() {
  return liveState.weather;
}

/** Returns `hours` historical weather records synthesised from the live state */
export function getWeatherHistory(hours = 48) {
  const now = new Date();
  const w = liveState.weather;
  const records = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const h = ts.getHours();
    const isDaytime = h >= 6 && h <= 18;
    records.push({
      timestamp: ts.toISOString(),
      region: w.region,
      temperature: parseFloat((w.temperature + (Math.random() - 0.5) * 3).toFixed(1)),
      windSpeed: parseFloat((w.windSpeed + (Math.random() - 0.5) * 2).toFixed(1)),
      windDirection: w.windDirection,
      solarIrradiance: isDaytime
        ? parseFloat((w.solarIrradiance * Math.sin(((h - 6) / 12) * Math.PI) + (Math.random() - 0.5) * 40).toFixed(0))
        : 0,
      cloudCover: parseFloat((w.cloudCover + (Math.random() - 0.5) * 8).toFixed(0)),
      humidity: parseFloat((w.humidity + (Math.random() - 0.5) * 5).toFixed(0)),
      rainProbability: parseFloat((w.rainProbability + (Math.random() - 0.5) * 3).toFixed(0)),
      feelsLike: parseFloat((w.feelsLike + (Math.random() - 0.5) * 2).toFixed(1)),
    });
  }
  return records;
}

// ─── Grid ─────────────────────────────────────────────────────────────────────
export function getGrid() {
  return liveState.grid;
}

export function getGridHistory(hours = 48) {
  const now = new Date();
  const g = liveState.grid;
  const records = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const h = ts.getHours();
    const isDaytime = h >= 6 && h <= 18;
    const solar = isDaytime ? 300 + Math.sin(((h - 6) / 12) * Math.PI) * 160 : 0;
    const wind = 25 + Math.sin(i * 0.3) * 6 + Math.random() * 4;
    const totalGen = solar + wind;
    const demand = g.demandMW + (Math.random() - 0.5) * 30;
    const surplus = Math.max(0, totalGen - demand);
    const exportMW = Math.min(surplus, 40);
    const storageMW = Math.min(surplus - exportMW, 30);
    records.push({
      timestamp: ts.toISOString(),
      generationMW: parseFloat(totalGen.toFixed(1)),
      demandMW: parseFloat(demand.toFixed(1)),
      exportMW: parseFloat(exportMW.toFixed(1)),
      storageMW: parseFloat(storageMW.toFixed(1)),
      curtailmentMW: parseFloat(Math.max(0, surplus - exportMW - storageMW).toFixed(1)),
      gridFrequency: parseFloat((49.9 + Math.random() * 0.2).toFixed(3)),
    });
  }
  return records;
}

// ─── Generation ───────────────────────────────────────────────────────────────
export function getGenerationHistory(hours = 72) {
  const now = new Date();
  const records = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const h = ts.getHours();
    const isDaytime = h >= 6 && h <= 18;
    const solarBase = isDaytime ? 380 + Math.sin(((h - 6) / 12) * Math.PI) * 200 : 0;
    const solar = Math.max(0, solarBase + (Math.random() - 0.5) * 40);
    const wind = 25 + Math.sin(i * 0.5) * 8 + Math.random() * 6;
    const total = solar + wind;
    records.push({
      timestamp: ts.toISOString(),
      solarMW: parseFloat(solar.toFixed(1)),
      windMW: parseFloat(wind.toFixed(1)),
      totalMW: parseFloat(total.toFixed(1)),
      expectedMW: parseFloat(Math.max(0, solarBase + 28).toFixed(1)),
    });
  }
  return records;
}

export function getGenerationForecast(hours = 72) {
  const now = new Date();
  const records = [];
  for (let h = 0; h <= hours; h++) {
    const ts = addHours(now, h);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const solarBase = isDaytime ? 380 + Math.sin(((hour - 6) / 12) * Math.PI) * 200 : 0;
    const cloudEffect = h > 36 ? 0.88 : 1.0;
    const windSurge = h >= 48 && h <= 54 ? 1.6 : 1.0;
    const solar = Math.max(0, solarBase * cloudEffect + (Math.random() - 0.5) * 20);
    const wind = (26 + Math.sin(h * 0.3) * 7 + Math.random() * 4) * windSurge;
    const total = solar + wind;
    records.push({
      timestamp: ts.toISOString(),
      solarMW: parseFloat(solar.toFixed(1)),
      windMW: parseFloat(wind.toFixed(1)),
      totalMW: parseFloat(total.toFixed(1)),
      confidenceLow: parseFloat(Math.max(0, total * 0.92).toFixed(1)),
      confidenceHigh: parseFloat((total * 1.08).toFixed(1)),
      weatherImpact: h >= 48 && h <= 54
        ? '⚡ High wind — turbine over-speed risk'
        : h > 36
          ? 'Cloud cover — 12% solar reduction'
          : 'Clear conditions',
    });
  }
  return records;
}

// ─── Maintenance ──────────────────────────────────────────────────────────────
export function getMaintenanceRecords() {
  // Derive live maintenance records from current asset health scores
  return liveState.assets
    .filter(a => a.healthScore < 90)
    .sort((a, b) => a.healthScore - b.healthScore)
    .map((a, i) => ({
      id: `M-${String(i + 1).padStart(3, '0')}`,
      assetId: a.assetId,
      assetName: a.name,
      assetType: a.type,
      healthScore: parseFloat(a.healthScore.toFixed(1)),
      failureRisk: parseFloat((100 - a.healthScore).toFixed(1)),
      riskLevel: a.riskLevel,
      issue: deriveIssue(a),
      recommendation: deriveRecommendation(a),
      estimatedWindow: deriveWindow(a),
      component: deriveComponent(a),
      lastInspection: a.lastMaintenance,
    }));
}

function deriveIssue(a: ReturnType<typeof getAssets>[0]): string {
  if (a.assetId === 'WT-07') return `Gearbox vibration ${((a.vibration / 0.65 - 1) * 100).toFixed(0)}% above baseline — output below expected`;
  if (a.assetId === 'WT-08') return 'Complete drivetrain failure — turbine offline';
  if (a.assetId === 'SF-06') return 'Dust storm impact — panel irradiance blocked, tracker jammed';
  if (a.assetId === 'HY-03') return `Inverter thermal limit exceeded — temperature ${a.temperature.toFixed(1)}°C (limit 55°C)`;
  if (a.assetId === 'WT-10') return 'SCADA communication failure — telemetry offline';
  if (a.type === 'solar' && a.temperature > 45) return `High temperature ${a.temperature.toFixed(1)}°C — inverter thermal stress`;
  if (a.type === 'wind' && a.vibration > 0.6) return `Elevated vibration ${a.vibration.toFixed(2)} — bearing inspection required`;
  return `Health score ${a.healthScore.toFixed(0)}% — scheduled inspection due`;
}

function deriveRecommendation(a: ReturnType<typeof getAssets>[0]): string {
  if (a.assetId === 'WT-07') return 'Inspect gearbox assembly; check oil levels and bearing wear';
  if (a.assetId === 'WT-08') return 'Emergency replacement of main bearing and gearbox';
  if (a.assetId === 'SF-06') return 'Emergency panel cleaning; inspect tracker motors for sand ingress';
  if (a.assetId === 'HY-03') return 'Reduce charge rate to 20%; inspect HVAC cooling system';
  if (a.assetId === 'WT-10') return 'Dispatch field engineer; attempt remote SCADA gateway reboot';
  if (a.type === 'solar') return 'Inspect inverter cooling fins and thermal management system';
  if (a.type === 'wind') return 'Perform vibration analysis; check bearing wear patterns';
  return 'Schedule standard maintenance inspection';
}

function deriveWindow(a: ReturnType<typeof getAssets>[0]): string {
  if (a.healthScore <= 25) return 'Immediate — within 24 hours';
  if (a.healthScore <= 40) return 'Urgent — within 48 hours';
  if (a.healthScore <= 55) return '2–4 days';
  if (a.healthScore <= 70) return '5–7 days';
  return '14–21 days';
}

function deriveComponent(a: ReturnType<typeof getAssets>[0]): string {
  if (a.assetId === 'WT-07' || a.assetId === 'WT-08') return 'Gearbox / Main Bearing';
  if (a.assetId === 'SF-06') return 'PV Panels + Tracker Motors';
  if (a.assetId === 'HY-03') return 'Battery Inverter HVAC';
  if (a.assetId === 'WT-10') return 'SCADA Gateway / Comms Module';
  if (a.type === 'solar') return 'Solar Inverter';
  if (a.type === 'wind') return 'Drivetrain / Bearings';
  return 'General Inspection';
}

// ─── Alerts ───────────────────────────────────────────────────────────────────
export function getAlerts() {
  // Dynamically generate alerts from current live state
  const now = new Date().toISOString();
  const alerts: any[] = [];

  for (const a of liveState.assets) {
    if (a.riskLevel === 'CRITICAL' || a.healthScore <= 30) {
      alerts.push({
        id: `ALT-${a.assetId}`, severity: 'critical', category: 'maintenance',
        assetId: a.assetId, assetName: a.name, timestamp: now,
        title: `CRITICAL — ${a.name} (Health: ${a.healthScore.toFixed(0)}%)`,
        problem: deriveIssue(a),
        aiExplanation: `Health score: ${a.healthScore.toFixed(1)}%. Risk: ${(100 - a.healthScore).toFixed(0)}%. ${deriveIssue(a)}.`,
        recommendedAction: deriveRecommendation(a),
        acknowledged: false, resolved: false,
      });
    } else if (a.riskLevel === 'HIGH' || a.healthScore <= 65) {
      alerts.push({
        id: `ALT-${a.assetId}`, severity: 'high', category: 'performance',
        assetId: a.assetId, assetName: a.name, timestamp: now,
        title: `HIGH RISK — ${a.name} (Health: ${a.healthScore.toFixed(0)}%)`,
        problem: deriveIssue(a),
        aiExplanation: `Health score: ${a.healthScore.toFixed(1)}%. Failure risk: ${(100 - a.healthScore).toFixed(0)}%. ${deriveIssue(a)}.`,
        recommendedAction: deriveRecommendation(a),
        acknowledged: false, resolved: false,
      });
    }
  }

  // Grid frequency alert
  if (liveState.grid.gridFrequency > 50.3 || liveState.grid.gridFrequency < 49.7) {
    alerts.push({
      id: 'ALT-GRID-FREQ', severity: 'warning', category: 'grid',
      assetId: null, assetName: null, timestamp: now,
      title: `Grid Frequency Deviation — ${liveState.grid.gridFrequency.toFixed(3)} Hz`,
      problem: `Grid frequency is ${liveState.grid.gridFrequency.toFixed(3)} Hz (nominal: 50.00 Hz ± 0.2 Hz).`,
      aiExplanation: `Frequency deviation detected. Generation/demand imbalance of approximately ${Math.abs(liveState.grid.generationMW - liveState.grid.demandMW).toFixed(1)} MW.`,
      recommendedAction: liveState.grid.gridFrequency > 50.3
        ? 'Reduce generation or increase storage charging to bring frequency down.'
        : 'Increase generation or reduce export to bring frequency up.',
      acknowledged: false, resolved: false,
    });
  }

  return alerts;
}

// ─── Agents status ────────────────────────────────────────────────────────────
export function getAgents() {
  const now = new Date();
  const fmt = (d: Date) => d.toTimeString().slice(0, 8);
  return [
    { id: 'weather-agent',     name: 'Weather Agent',               description: 'Analyzes regional weather — temperature, irradiance, wind, dust index, extreme events', status: 'completed', lastRun: fmt(new Date(now.getTime() - 6_000)), analysisCount: 1247 + liveState.tickCount, alertsGenerated: 23 },
    { id: 'forecast-agent',    name: 'Generation Forecast Agent',   description: 'Predicts solar/wind generation with edge-case models: dust storms, monsoon, high-wind', status: 'completed', lastRun: fmt(new Date(now.getTime() - 5_000)), analysisCount: 1244 + liveState.tickCount, alertsGenerated: 31 },
    { id: 'performance-agent', name: 'Asset Performance Agent',     description: 'Monitors 19 assets — anomaly detection, comm-loss, thermal derating, dust impact',     status: liveState.assets.some(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL') ? 'warning' : 'completed', lastRun: fmt(new Date(now.getTime() - 4_000)), analysisCount: 1241 + liveState.tickCount, alertsGenerated: 87 },
    { id: 'maintenance-agent', name: 'Predictive Maintenance Agent', description: 'Predicts failures — mechanical, thermal, electrical, SCADA communication modes',       status: 'completed', lastRun: fmt(new Date(now.getTime() - 3_000)), analysisCount: 1238 + liveState.tickCount, alertsGenerated: 52 },
    { id: 'grid-agent',        name: 'Grid Optimization Agent',     description: 'Manages export/storage/curtailment — emergency blackout + frequency deviation response', status: 'completed', lastRun: fmt(new Date(now.getTime() - 2_000)), analysisCount: 1235 + liveState.tickCount, alertsGenerated: 19 },
    { id: 'dashboard-agent',   name: 'Dashboard Agent',             description: 'Orchestrates all agents — unified executive summaries and prioritized operator actions', status: 'completed', lastRun: fmt(new Date(now.getTime() - 1_000)), analysisCount: 1232 + liveState.tickCount, alertsGenerated: 142 },
  ];
}

// ─── Full live state (for SSE snapshot) ──────────────────────────────────────
export function getLiveState() {
  return liveState;
}
