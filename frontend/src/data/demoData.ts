import { Asset, WeatherData, GenerationRecord, GenerationForecast, MaintenanceRecord, GridRecord, Alert, AgentEvent, Agent } from '../types';
import { subHours, subDays, addHours, format } from 'date-fns';

const now = new Date();

// ─── ASSETS (16 assets + 3 edge-case assets) ──────────────────────────────────
export const assets: Asset[] = [
  // Solar Farms
  {
    assetId: 'SF-01', name: 'Kutch Solar Farm Alpha', type: 'solar', region: 'Kutch',
    location: { lat: 23.73, lng: 69.86 },
    capacityMW: 150, currentOutputMW: 132.4, expectedOutputMW: 140.2,
    efficiency: 94.4, healthScore: 91, status: 'online', riskLevel: 'LOW',
    temperature: 38.2, vibration: 0.12, lastMaintenance: '2024-11-15',
    nextMaintenance: '2025-03-15', operatingHours: 18420,
    description: 'Large-scale solar PV installation near Bhuj, Gujarat'
  },
  {
    assetId: 'SF-02', name: 'Mundra Solar Park', type: 'solar', region: 'Kutch',
    location: { lat: 22.84, lng: 69.72 },
    capacityMW: 200, currentOutputMW: 171.8, expectedOutputMW: 185.0,
    efficiency: 92.9, healthScore: 87, status: 'warning', riskLevel: 'MEDIUM',
    temperature: 41.6, vibration: 0.18, lastMaintenance: '2024-10-08',
    nextMaintenance: '2025-02-08', operatingHours: 21340,
    description: 'Coastal solar facility at Mundra industrial zone'
  },
  {
    assetId: 'SF-03', name: 'Nakhatrana Solar Station', type: 'solar', region: 'Kutch',
    location: { lat: 23.33, lng: 69.27 },
    capacityMW: 100, currentOutputMW: 94.7, expectedOutputMW: 96.0,
    efficiency: 98.6, healthScore: 96, status: 'online', riskLevel: 'LOW',
    temperature: 36.8, vibration: 0.09, lastMaintenance: '2024-12-01',
    nextMaintenance: '2025-06-01', operatingHours: 12080,
    description: 'Modern solar installation with advanced tracking systems'
  },
  {
    assetId: 'SF-04', name: 'Deesa Solar Array', type: 'solar', region: 'Banaskantha',
    location: { lat: 24.26, lng: 72.20 },
    capacityMW: 80, currentOutputMW: 67.2, expectedOutputMW: 74.8,
    efficiency: 89.8, healthScore: 78, status: 'warning', riskLevel: 'MEDIUM',
    temperature: 43.1, vibration: 0.22, lastMaintenance: '2024-09-12',
    nextMaintenance: '2025-01-20', operatingHours: 24500,
    description: 'Northern Gujarat solar installation in Banaskantha district'
  },
  {
    assetId: 'SF-05', name: 'Palanpur Solar Complex', type: 'solar', region: 'Banaskantha',
    location: { lat: 24.17, lng: 72.43 },
    capacityMW: 120, currentOutputMW: 104.3, expectedOutputMW: 112.8,
    efficiency: 92.5, healthScore: 88, status: 'online', riskLevel: 'LOW',
    temperature: 39.4, vibration: 0.14, lastMaintenance: '2024-11-28',
    nextMaintenance: '2025-05-28', operatingHours: 15620,
    description: 'Large rooftop and ground-mount hybrid solar complex'
  },
  // ── EDGE CASE: Dust storm degraded solar farm ──
  {
    assetId: 'SF-06', name: 'Rann Solar Station', type: 'solar', region: 'Kutch',
    location: { lat: 23.90, lng: 70.41 },
    capacityMW: 90, currentOutputMW: 18.2, expectedOutputMW: 83.7,
    efficiency: 21.7, healthScore: 34, status: 'warning', riskLevel: 'CRITICAL',
    temperature: 49.6, vibration: 0.08, lastMaintenance: '2024-08-01',
    nextMaintenance: '2025-01-08', operatingHours: 22100,
    description: '⚠️ DUST STORM IMPACT — Severe sand accumulation on panels. Irradiance blocked 78%. Emergency cleaning dispatched.'
  },

  // Wind Turbines
  {
    assetId: 'WT-01', name: 'Kutch Wind Turbine 01', type: 'wind', region: 'Kutch',
    location: { lat: 23.51, lng: 69.11 },
    capacityMW: 2.5, currentOutputMW: 2.31, expectedOutputMW: 2.28,
    efficiency: 101.3, healthScore: 95, status: 'online', riskLevel: 'LOW',
    temperature: 34.2, vibration: 0.31, rpm: 14.8,
    lastMaintenance: '2024-12-01', nextMaintenance: '2025-06-01', operatingHours: 9840,
    description: 'GW 136/3600 class turbine at Kutch wind corridor'
  },
  {
    assetId: 'WT-02', name: 'Kutch Wind Turbine 02', type: 'wind', region: 'Kutch',
    location: { lat: 23.52, lng: 69.12 },
    capacityMW: 2.5, currentOutputMW: 2.18, expectedOutputMW: 2.28,
    efficiency: 95.6, healthScore: 89, status: 'online', riskLevel: 'LOW',
    temperature: 35.1, vibration: 0.38, rpm: 14.2,
    lastMaintenance: '2024-11-15', nextMaintenance: '2025-05-15', operatingHours: 11200,
    description: 'GW 136/3600 class turbine at Kutch wind corridor'
  },
  {
    assetId: 'WT-03', name: 'Kutch Wind Turbine 03', type: 'wind', region: 'Kutch',
    location: { lat: 23.53, lng: 69.13 },
    capacityMW: 2.5, currentOutputMW: 2.29, expectedOutputMW: 2.28,
    efficiency: 100.4, healthScore: 94, status: 'online', riskLevel: 'LOW',
    temperature: 33.8, vibration: 0.29, rpm: 14.9,
    lastMaintenance: '2024-12-10', nextMaintenance: '2025-06-10', operatingHours: 8960,
    description: 'GW 136/3600 class turbine at Kutch wind corridor'
  },
  {
    assetId: 'WT-04', name: 'Bhuj Wind Farm T-04', type: 'wind', region: 'Kutch',
    location: { lat: 23.25, lng: 69.67 },
    capacityMW: 3.0, currentOutputMW: 2.74, expectedOutputMW: 2.82,
    efficiency: 97.2, healthScore: 90, status: 'online', riskLevel: 'LOW',
    temperature: 35.6, vibration: 0.34, rpm: 13.6,
    lastMaintenance: '2024-10-20', nextMaintenance: '2025-04-20', operatingHours: 14320,
    description: 'High-capacity turbine in Bhuj wind zone'
  },
  {
    assetId: 'WT-05', name: 'Bhuj Wind Farm T-05', type: 'wind', region: 'Kutch',
    location: { lat: 23.26, lng: 69.68 },
    capacityMW: 3.0, currentOutputMW: 2.31, expectedOutputMW: 2.82,
    efficiency: 81.9, healthScore: 72, status: 'warning', riskLevel: 'MEDIUM',
    temperature: 39.2, vibration: 0.68, rpm: 11.8,
    lastMaintenance: '2024-09-05', nextMaintenance: '2025-01-10', operatingHours: 19640,
    description: 'Turbine showing early-stage performance degradation'
  },
  {
    assetId: 'WT-06', name: 'Banaskantha Wind T-06', type: 'wind', region: 'Banaskantha',
    location: { lat: 24.03, lng: 71.81 },
    capacityMW: 2.5, currentOutputMW: 2.11, expectedOutputMW: 2.28,
    efficiency: 92.5, healthScore: 84, status: 'online', riskLevel: 'LOW',
    temperature: 36.4, vibration: 0.41, rpm: 13.9,
    lastMaintenance: '2024-11-01', nextMaintenance: '2025-05-01', operatingHours: 16200,
    description: 'Wind turbine in northern Gujarat wind cluster'
  },
  {
    assetId: 'WT-07', name: 'Banaskantha Wind T-07', type: 'wind', region: 'Banaskantha',
    location: { lat: 24.04, lng: 71.82 },
    capacityMW: 2.5, currentOutputMW: 1.68, expectedOutputMW: 2.05,
    efficiency: 82.0, healthScore: 61, status: 'warning', riskLevel: 'HIGH',
    temperature: 42.8, vibration: 0.89, rpm: 10.4,
    lastMaintenance: '2024-08-14', nextMaintenance: '2025-01-05', operatingHours: 27800,
    description: '⚠️ ANOMALY DETECTED — Gearbox degradation suspected. Primary focus of WT-07 demo scenario.'
  },
  {
    assetId: 'WT-08', name: 'Banaskantha Wind T-08', type: 'wind', region: 'Banaskantha',
    location: { lat: 24.05, lng: 71.83 },
    capacityMW: 2.5, currentOutputMW: 0.0, expectedOutputMW: 2.28,
    efficiency: 0.0, healthScore: 22, status: 'maintenance', riskLevel: 'CRITICAL',
    temperature: 28.1, vibration: 0.0, rpm: 0.0,
    lastMaintenance: '2025-01-02', nextMaintenance: '2025-01-15', operatingHours: 31200,
    description: '🔴 OFFLINE — Critical failure. Scheduled maintenance in progress.'
  },
  {
    assetId: 'WT-09', name: 'Deesa Wind Station T-09', type: 'wind', region: 'Banaskantha',
    location: { lat: 24.27, lng: 72.22 },
    capacityMW: 2.0, currentOutputMW: 1.88, expectedOutputMW: 1.92,
    efficiency: 97.9, healthScore: 93, status: 'online', riskLevel: 'LOW',
    temperature: 33.9, vibration: 0.27, rpm: 15.1,
    lastMaintenance: '2024-12-15', nextMaintenance: '2025-06-15', operatingHours: 7840,
    description: 'Newer installation with good performance history'
  },
  // ── EDGE CASE: Communication loss — sensor data stale ──
  {
    assetId: 'WT-10', name: 'Bhuj Offshore Wind T-10', type: 'wind', region: 'Kutch',
    location: { lat: 22.91, lng: 69.43 },
    capacityMW: 3.5, currentOutputMW: 0.0, expectedOutputMW: 3.2,
    efficiency: 0.0, healthScore: 45, status: 'offline', riskLevel: 'HIGH',
    temperature: 0, vibration: 0, rpm: 0,
    lastMaintenance: '2024-10-10', nextMaintenance: '2025-02-10', operatingHours: 17300,
    description: '📡 COMM LOSS — SCADA telemetry offline for 4h 22m. Last known output: 3.1 MW. Field inspection dispatched.'
  },

  // Hybrid Sites
  {
    assetId: 'HY-01', name: 'Kutch Hybrid Energy Station', type: 'hybrid', region: 'Kutch',
    location: { lat: 23.60, lng: 69.50 },
    capacityMW: 75, currentOutputMW: 64.8, expectedOutputMW: 68.4,
    efficiency: 94.7, healthScore: 89, status: 'online', riskLevel: 'LOW',
    temperature: 37.6, vibration: 0.19, lastMaintenance: '2024-11-20',
    nextMaintenance: '2025-05-20', operatingHours: 13400,
    description: 'Combined solar PV and wind hybrid plant with battery storage'
  },
  {
    assetId: 'HY-02', name: 'Banaskantha Hybrid Park', type: 'hybrid', region: 'Banaskantha',
    location: { lat: 24.15, lng: 72.10 },
    capacityMW: 50, currentOutputMW: 38.9, expectedOutputMW: 46.5,
    efficiency: 83.7, healthScore: 74, status: 'warning', riskLevel: 'MEDIUM',
    temperature: 44.3, vibration: 0.31, lastMaintenance: '2024-09-28',
    nextMaintenance: '2025-01-28', operatingHours: 20100,
    description: 'Hybrid installation with aging inverter components requiring attention'
  },
  // ── EDGE CASE: Extreme heat causing thermal shutdown ──
  {
    assetId: 'HY-03', name: 'Bhuj Hybrid Storage Complex', type: 'hybrid', region: 'Kutch',
    location: { lat: 23.28, lng: 69.82 },
    capacityMW: 60, currentOutputMW: 24.1, expectedOutputMW: 56.4,
    efficiency: 42.7, healthScore: 53, status: 'warning', riskLevel: 'HIGH',
    temperature: 58.3, vibration: 0.44, lastMaintenance: '2024-07-15',
    nextMaintenance: '2024-12-20', operatingHours: 19800,
    description: '🌡️ THERMAL ALERT — Battery inverter temperature 58.3°C (limit: 55°C). 3 inverter strings auto-derated to 40% capacity. Cooling system check required.'
  },
];

// ─── WEATHER DATA (with edge-case weather events) ──────────────────────────────
export function generateWeatherData(hours = 48): WeatherData[] {
  const data: WeatherData[] = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;

    // Edge case: simulate dust storm window at hours 30–38
    const isDustStorm = i >= 30 && i <= 38;
    // Edge case: simulate monsoon surge at hours 15–18
    const isMonsoon = i >= 15 && i <= 18;

    const baseTemp = isDustStorm ? 49 : (isMonsoon ? 27 : 32);
    const irradiance = isDustStorm
      ? (isDaytime ? 80 + Math.random() * 40 : 0)          // near-zero during dust storm
      : isMonsoon
        ? (isDaytime ? 120 + Math.random() * 60 : 0)       // very low in monsoon
        : (isDaytime ? 600 + Math.sin((hour - 6) * Math.PI / 12) * 350 + (Math.random() - 0.5) * 50 : 0);
    const cloudCover = isDustStorm ? 90 + Math.random() * 8 : isMonsoon ? 95 + Math.random() * 4 : 10 + Math.random() * 30;
    const windSpeed = isDustStorm ? 18 + Math.random() * 8 : isMonsoon ? 3 + Math.random() * 2 : 6 + Math.sin(i * 0.3) * 3 + Math.random() * 2;

    data.push({
      timestamp: ts.toISOString(),
      region: i % 2 === 0 ? 'Kutch' : 'Banaskantha',
      temperature: parseFloat((baseTemp + Math.sin((hour - 6) * Math.PI / 12) * 8 + (Math.random() - 0.5) * 2).toFixed(1)),
      windSpeed: parseFloat(windSpeed.toFixed(1)),
      windDirection: isDustStorm ? 'SW' : ['NW', 'NNW', 'N', 'NE', 'W'][Math.floor(Math.random() * 5)],
      solarIrradiance: parseFloat(Math.max(0, irradiance).toFixed(0)),
      cloudCover: parseFloat(Math.min(100, cloudCover).toFixed(0)),
      humidity: isMonsoon ? 88 + Math.random() * 10 : 35 + Math.random() * 20,
      rainProbability: isMonsoon ? 85 + Math.random() * 14 : isDustStorm ? 2 : Math.random() * 15,
      feelsLike: parseFloat((baseTemp + 3 + Math.sin((hour - 6) * Math.PI / 12) * 7).toFixed(1)),
    });
  }
  return data;
}

// ─── GENERATION HISTORY (with event anomalies baked in) ───────────────────────
export function generateHistoricalGeneration(days = 30): GenerationRecord[] {
  const data: GenerationRecord[] = [];
  for (let d = days; d >= 0; d--) {
    for (let h = 0; h < 24; h++) {
      const ts = subHours(now, d * 24 + (24 - h));
      const isDaytime = h >= 6 && h <= 18;

      // Edge case injection: dust storm on day 12 (90% solar drop)
      const isDustStormDay = d === 12;
      // Edge case injection: grid blackout on day 7 between 14–17h (forced curtailment to 0)
      const isGridBlackout = d === 7 && h >= 14 && h <= 17;
      // Edge case injection: monsoon days 3–4 (solar near-zero, wind low)
      const isMonsoonDay = d >= 3 && d <= 4;
      // Edge case injection: night wind spike on day 20 between 01–04h
      const isNightWindSpike = d === 20 && h >= 1 && h <= 4;

      const solarBase = isDaytime ? 380 + Math.sin((h - 6) * Math.PI / 12) * 200 : 0;
      let solar = Math.max(0, solarBase + (Math.random() - 0.5) * 40);
      let wind = 25 + Math.sin(d * 0.5) * 8 + Math.random() * 6;

      if (isDustStormDay) solar *= 0.10;
      if (isMonsoonDay) { solar *= 0.15; wind *= 0.4; }
      if (isGridBlackout) { solar = 0; wind = 0; }
      if (isNightWindSpike) wind = 68 + Math.random() * 12; // sudden gust — over-speed protection

      const total = solar + wind;
      const expected = solarBase + 28 + Math.sin(d * 0.5) * 8;

      data.push({
        timestamp: ts.toISOString(),
        solarMW: parseFloat(solar.toFixed(1)),
        windMW: parseFloat(wind.toFixed(1)),
        totalMW: parseFloat(total.toFixed(1)),
        expectedMW: parseFloat(Math.max(0, expected).toFixed(1)),
      });
    }
  }
  return data;
}

// ─── GENERATION FORECAST ──────────────────────────────────────────────────────
export function generateForecast(hours = 72): GenerationForecast[] {
  const data: GenerationForecast[] = [];
  for (let h = 0; h <= hours; h++) {
    const ts = addHours(now, h);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const solarBase = isDaytime ? 380 + Math.sin((hour - 6) * Math.PI / 12) * 200 : 0;
    const cloudEffect = h > 36 ? 0.88 : 1.0;
    // Forecast includes a near-future high wind event (hours 48–54)
    const windSurge = (h >= 48 && h <= 54) ? 1.6 : 1.0;
    const solar = Math.max(0, solarBase * cloudEffect + (Math.random() - 0.5) * 20);
    const wind = (26 + Math.sin(h * 0.3) * 7 + Math.random() * 4) * windSurge;
    const total = solar + wind;
    const variance = total * 0.08;
    data.push({
      timestamp: ts.toISOString(),
      solarMW: parseFloat(solar.toFixed(1)),
      windMW: parseFloat(wind.toFixed(1)),
      totalMW: parseFloat(total.toFixed(1)),
      confidenceLow: parseFloat(Math.max(0, total - variance).toFixed(1)),
      confidenceHigh: parseFloat((total + variance).toFixed(1)),
      weatherImpact: h >= 48 && h <= 54
        ? '⚡ High wind forecast — turbine over-speed risk. Auto-derating may activate.'
        : h > 36
          ? 'Cloud cover expected — 12% reduction in solar'
          : 'Clear conditions',
    });
  }
  return data;
}

// ─── MAINTENANCE RECORDS ──────────────────────────────────────────────────────
export const maintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'M-001', assetId: 'WT-08', assetName: 'Banaskantha Wind T-08',
    assetType: 'wind', healthScore: 22, failureRisk: 96, riskLevel: 'CRITICAL',
    issue: 'Complete drivetrain failure — turbine taken offline',
    recommendation: 'Emergency replacement of main bearing and gearbox',
    estimatedWindow: 'Immediate — 7–14 days', component: 'Main Bearing / Gearbox',
    lastInspection: '2025-01-02',
  },
  {
    id: 'M-002', assetId: 'WT-07', assetName: 'Banaskantha Wind T-07',
    assetType: 'wind', healthScore: 61, failureRisk: 72, riskLevel: 'HIGH',
    issue: 'Gearbox vibration 23% above baseline — power output 18% below expected',
    recommendation: 'Inspect gearbox assembly; check oil levels and bearing wear',
    estimatedWindow: '2–4 days', component: 'Gearbox',
    lastInspection: '2024-08-14',
  },
  {
    id: 'M-003', assetId: 'SF-04', assetName: 'Deesa Solar Array',
    assetType: 'solar', healthScore: 78, failureRisk: 48, riskLevel: 'MEDIUM',
    issue: 'Rising inverter temperature — 9% efficiency drop over 7 days',
    recommendation: 'Clean cooling fins; inspect inverter fans and thermal management',
    estimatedWindow: '5–7 days', component: 'Solar Inverter INV-12',
    lastInspection: '2024-09-12',
  },
  {
    id: 'M-004', assetId: 'WT-05', assetName: 'Bhuj Wind Farm T-05',
    assetType: 'wind', healthScore: 72, failureRisk: 41, riskLevel: 'MEDIUM',
    issue: 'Vibration trending upward — RPM below rated curve',
    recommendation: 'Blade inspection and pitch control system check',
    estimatedWindow: '7–10 days', component: 'Blade / Pitch Control',
    lastInspection: '2024-09-05',
  },
  {
    id: 'M-005', assetId: 'HY-02', assetName: 'Banaskantha Hybrid Park',
    assetType: 'hybrid', healthScore: 74, failureRisk: 38, riskLevel: 'MEDIUM',
    issue: 'Aging string inverters — efficiency at 83.7% vs 91% design target',
    recommendation: 'Schedule inverter replacement; inspect DC/AC conversion units',
    estimatedWindow: '10–14 days', component: 'String Inverters',
    lastInspection: '2024-09-28',
  },
  {
    id: 'M-006', assetId: 'SF-02', assetName: 'Mundra Solar Park',
    assetType: 'solar', healthScore: 87, failureRisk: 22, riskLevel: 'LOW',
    issue: 'Panel surface soiling detected — minor efficiency reduction',
    recommendation: 'Schedule panel cleaning during next maintenance window',
    estimatedWindow: '14–21 days', component: 'PV Panels',
    lastInspection: '2024-10-08',
  },
  {
    id: 'M-007', assetId: 'WT-06', assetName: 'Banaskantha Wind T-06',
    assetType: 'wind', healthScore: 84, failureRisk: 19, riskLevel: 'LOW',
    issue: 'Minor lubrication interval due — routine maintenance',
    recommendation: 'Perform standard lubrication and sensor calibration',
    estimatedWindow: '21–30 days', component: 'Main Shaft Bearings',
    lastInspection: '2024-11-01',
  },
  // Edge-case maintenance records
  {
    id: 'M-008', assetId: 'SF-06', assetName: 'Rann Solar Station',
    assetType: 'solar', healthScore: 34, failureRisk: 88, riskLevel: 'CRITICAL',
    issue: 'Severe dust storm accumulation — panel irradiance blocked 78%. Tracker mechanism jammed.',
    recommendation: 'Emergency manual cleaning + tracker motor inspection. Do not wait for scheduled cycle.',
    estimatedWindow: 'Immediate — 24–48 hours', component: 'PV Panels + Tracker Motors',
    lastInspection: '2024-08-01',
  },
  {
    id: 'M-009', assetId: 'HY-03', assetName: 'Bhuj Hybrid Storage Complex',
    assetType: 'hybrid', healthScore: 53, failureRisk: 78, riskLevel: 'HIGH',
    issue: 'Battery inverter thermal runaway risk — 3 strings at 58.3°C (limit 55°C)',
    recommendation: 'Reduce charge rate to 30%, increase cooling airflow, inspect HVAC unit',
    estimatedWindow: 'Within 12 hours', component: 'Battery Inverter HVAC',
    lastInspection: '2024-07-15',
  },
  {
    id: 'M-010', assetId: 'WT-10', assetName: 'Bhuj Offshore Wind T-10',
    assetType: 'wind', healthScore: 45, failureRisk: 65, riskLevel: 'HIGH',
    issue: 'SCADA communication failure — telemetry offline 4h 22m. Cannot confirm operational state.',
    recommendation: 'Dispatch field engineer for visual inspection and SCADA gateway reboot',
    estimatedWindow: 'Immediate — within 2 hours', component: 'SCADA Gateway / Comms Module',
    lastInspection: '2024-10-10',
  },
];

// ─── GRID DATA (with blackout and frequency spike edge cases) ─────────────────
export function generateGridData(hours = 48): GridRecord[] {
  const data: GridRecord[] = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;

    // Edge case: simulate a 3h grid export blackout (curtailment spike) at hours 36–39
    const isGridCurtailment = i >= 36 && i <= 39;
    // Edge case: frequency spike during high wind surge at hours 10–12
    const isFreqSpike = i >= 10 && i <= 12;

    const solarGen = isDaytime ? 300 + Math.sin((hour - 6) * Math.PI / 12) * 160 : 0;
    const windGen = 25 + Math.sin(i * 0.3) * 6 + Math.random() * 4;
    const totalGen = isGridCurtailment ? solarGen * 0.2 + windGen * 0.2 : solarGen + windGen;
    const demand = 280 + Math.sin((hour - 8) * Math.PI / 10) * 60 + Math.random() * 20;
    const surplus = Math.max(0, totalGen - demand);
    const exportMW = isGridCurtailment ? 0 : Math.min(surplus, 40);
    const storageMW = Math.min(surplus - exportMW, 30);
    const curtailmentMW = isGridCurtailment
      ? Math.max(0, solarGen + windGen - demand) // forced curtailment
      : Math.max(0, surplus - exportMW - storageMW);

    data.push({
      timestamp: ts.toISOString(),
      generationMW: parseFloat(totalGen.toFixed(1)),
      demandMW: parseFloat(demand.toFixed(1)),
      exportMW: parseFloat(exportMW.toFixed(1)),
      storageMW: parseFloat(storageMW.toFixed(1)),
      curtailmentMW: parseFloat(curtailmentMW.toFixed(1)),
      gridFrequency: isFreqSpike
        ? parseFloat((50.4 + Math.random() * 0.3).toFixed(3))  // over-frequency
        : parseFloat((49.9 + Math.random() * 0.2).toFixed(3)),
    });
  }
  return data;
}

// ─── ALERTS (expanded with all edge-case scenarios) ───────────────────────────
export const alerts: Alert[] = [
  {
    id: 'ALT-001', severity: 'critical', category: 'maintenance',
    assetId: 'WT-08', assetName: 'Banaskantha Wind T-08',
    timestamp: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'Critical Failure — Turbine Offline',
    problem: 'WT-08 has experienced a complete drivetrain failure and is currently offline.',
    aiExplanation: 'Rapid bearing temperature increase to 94°C triggered automatic protection shutdown. Vibration exceeded safety threshold 3× in the preceding 4 hours. Failure probability was at 96% — emergency shutdown was appropriate.',
    recommendedAction: 'Dispatch maintenance crew immediately. Estimated repair window: 7–14 days.',
    acknowledged: true, resolved: false,
  },
  {
    id: 'ALT-002', severity: 'high', category: 'performance',
    assetId: 'WT-07', assetName: 'Banaskantha Wind T-07',
    timestamp: format(subHours(now, 0.5), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'WT-07 Output 18% Below Expected',
    problem: 'Wind Turbine WT-07 is producing 18% below expected output under current wind conditions.',
    aiExplanation: 'Vibration has increased 23% above baseline over the past 72 hours. RPM is 10.4 vs rated 15.2 under current wind. Possible causes: gearbox efficiency degradation or pitch control anomaly. Health score has dropped from 81% to 61% in 7 days.',
    recommendedAction: 'Schedule gearbox inspection within 2–4 days. Reduce load on WT-07 cluster if generation margin allows.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-003', severity: 'high', category: 'maintenance',
    assetId: 'SF-04', assetName: 'Deesa Solar Array',
    timestamp: format(subHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'Inverter Temperature Trending High',
    problem: 'Solar Inverter INV-12 at Deesa Solar Array shows a sustained temperature increase.',
    aiExplanation: 'Inverter temperature has increased from 42°C to 51°C over the past 7 days. Efficiency has dropped 9% in parallel. This thermal trend combined with output degradation indicates cooling system failure or fan blockage.',
    recommendedAction: 'Inspect inverter cooling system within 72 hours. Clean cooling fins and test thermal management.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-004', severity: 'warning', category: 'grid',
    assetId: undefined, assetName: undefined,
    timestamp: format(subHours(now, 0.25), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'Curtailment Risk — Solar Peak Generation',
    problem: 'High solar generation forecast for 11:30–14:30 may exceed grid export capacity.',
    aiExplanation: 'Combined solar generation is projected to reach 485 MW between 11:30–14:30, exceeding available grid export capacity of 440 MW. Without action, approximately 45 MW may need to be curtailed.',
    recommendedAction: 'Pre-charge storage systems by 11:00. Maximize export to 440 MW. Alert grid operator for capacity coordination.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-005', severity: 'warning', category: 'weather',
    assetId: undefined, assetName: undefined,
    timestamp: format(subHours(now, 0.1), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'Cloud Cover Forecast After 14:00',
    problem: 'Increased cloud cover expected after 14:00, affecting solar output.',
    aiExplanation: 'Weather forecast shows cloud coverage increasing from 18% to 64% between 14:00–17:00. Solar irradiance expected to drop from 820 W/m² to 340 W/m². Impact: 11–16% reduction in total generation.',
    recommendedAction: 'Coordinate grid dispatch to account for reduced solar output post-14:00. Increase wind turbine availability to offset.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-006', severity: 'warning', category: 'performance',
    assetId: 'SF-02', assetName: 'Mundra Solar Park',
    timestamp: format(subHours(now, 3), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'Panel Efficiency Below Optimal — Soiling Detected',
    problem: 'Mundra Solar Park efficiency at 92.9% — soiling detected on panel surfaces.',
    aiExplanation: 'Satellite imagery analysis and irradiance comparison indicate panel surface soiling causing 7% efficiency reduction. Last cleaning was 87 days ago vs recommended 45-day cycle for coastal locations.',
    recommendedAction: 'Schedule panel cleaning in next 14 days. Prioritize panels in rows 12–18 showing highest soiling.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-007', severity: 'info', category: 'forecast',
    assetId: undefined, assetName: undefined,
    timestamp: format(subHours(now, 0.05), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'Generation Forecast Updated',
    problem: 'Daily generation forecast revised — total expected: 4,280 MWh.',
    aiExplanation: 'Updated weather data incorporated into generation forecast. Morning peak generation expected to be 4% higher due to clear sky conditions. Afternoon generation 6% lower due to cloud cover forecast. Net daily forecast revised from 4,340 MWh to 4,280 MWh.',
    recommendedAction: 'No immediate action required. Monitor afternoon weather conditions.',
    acknowledged: true, resolved: false,
  },

  // ── Edge-case alerts ──────────────────────────────────────────────────────────
  {
    id: 'ALT-008', severity: 'critical', category: 'weather',
    assetId: 'SF-06', assetName: 'Rann Solar Station',
    timestamp: format(subHours(now, 0.3), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'DUST STORM — SF-06 Output Collapsed 78%',
    problem: 'Severe dust storm event has reduced Rann Solar Station output from 83 MW to 18 MW. Tracker motors jammed.',
    aiExplanation: 'Anemometer data shows sustained SW winds at 22 m/s carrying heavy particulate load (PM10 > 2400 µg/m³). Solar irradiance dropped from 812 W/m² to 74 W/m² within 40 minutes. Tracker motor torque readings indicate sand ingress in 4 of 12 drive units. This is the Kutch desert dust season edge case — historically occurs 3–5 times per year.',
    recommendedAction: 'Activate dust storm protocol: halt tracker movement to prevent motor damage, dispatch cleaning crew, file grid operator notification for reduced generation.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-009', severity: 'critical', category: 'performance',
    assetId: 'HY-03', assetName: 'Bhuj Hybrid Storage Complex',
    timestamp: format(subHours(now, 0.15), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'THERMAL ALERT — Battery Inverter Approaching Thermal Limit',
    problem: 'Battery inverter temperature at 58.3°C (limit: 55°C). 3 strings auto-derated to 40% capacity. Risk of thermal shutdown.',
    aiExplanation: 'Ambient temperature of 49°C combined with maximum charge rate (during solar peak) has overwhelmed the cooling system. HVAC unit 2 shows reduced airflow — compressor filter likely blocked. At current rate, full thermal shutdown expected in 18 minutes. Heat wave forecast shows 51°C tomorrow — situation will worsen.',
    recommendedAction: 'IMMEDIATE: Reduce battery charge rate to 20%. Disable string inverters 3, 7, and 11 manually. Inspect HVAC unit 2 filter. Do not resume full operation until ambient < 45°C.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-010', severity: 'high', category: 'performance',
    assetId: 'WT-10', assetName: 'Bhuj Offshore Wind T-10',
    timestamp: format(subHours(now, 4.4), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'COMM LOSS — WT-10 Telemetry Offline 4h 22m',
    problem: 'SCADA communication with WT-10 lost at 09:14. Last known state: 3.1 MW output, all parameters normal.',
    aiExplanation: 'Communication loss is isolated to WT-10 — other turbines in the cluster are reporting normally. Most likely cause: SCADA gateway network card failure or cellular modem restart loop (observed in 3 prior incidents at this site). Turbine may still be generating — generation revenue impact estimated at 13.6 MWh if offline, or data gap if generating normally.',
    recommendedAction: 'Attempt remote gateway reboot via secondary OOB channel. If unsuccessful, dispatch field technician within 2 hours. Cross-check SLDC generation reports to estimate if turbine is generating.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-011', severity: 'critical', category: 'grid',
    assetId: undefined, assetName: undefined,
    timestamp: format(subHours(now, 36.5), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'GRID BLACKOUT — Forced Zero Export 3 Hours',
    problem: 'SLDC issued emergency curtailment order. All grid export halted for 3 hours due to 220kV transmission line fault.',
    aiExplanation: 'The Bhuj–Surendranagar 220kV line tripped at 14:12 due to a short circuit. Available export capacity dropped from 440 MW to 0 MW instantly. The AI grid agent detected the frequency deviation (49.3 Hz) 8 seconds before the SLDC notification arrived. Combined solar+wind generation of 412 MW was curtailed — estimated revenue loss: ₹28.4 lakh/hour.',
    recommendedAction: 'Maximize battery storage charging immediately. Reduce solar trackers to 50% angle to reduce generation stress. Prepare ramp-up schedule for when export resumes. Monitor SLDC notifications for line restoration ETA.',
    acknowledged: true, resolved: true,
  },
  {
    id: 'ALT-012', severity: 'warning', category: 'weather',
    assetId: undefined, assetName: undefined,
    timestamp: format(subHours(now, 0.08), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'HIGH WIND FORECAST — Over-Speed Risk Hours 48–54',
    problem: 'Wind speed forecast exceeds 25 m/s cut-out threshold for WT-01 through WT-09 in 48–54 hour window.',
    aiExplanation: 'IMD forecast shows a western disturbance bringing sustained winds of 26–31 m/s across the Kutch wind corridor between T+48 and T+54 hours. All GW 136/3600 turbines have automatic cut-out at 25 m/s. Expected generation loss: 18–22 MWh across 9 turbines. Offshore turbine WT-10 (if communication restored) has higher cut-out at 28 m/s.',
    recommendedAction: 'Pre-position maintenance crew. Alert grid operator of potential 20 MW sudden drop at T+48h. Review turbine pitch control firmware — WT-05 pitch system anomaly may worsen in high wind.',
    acknowledged: false, resolved: false,
  },
  {
    id: 'ALT-013', severity: 'warning', category: 'performance',
    assetId: undefined, assetName: undefined,
    timestamp: format(subHours(now, 72), "yyyy-MM-dd'T'HH:mm:ss"),
    title: 'MONSOON SURGE — Solar Generation 85% Below Forecast',
    problem: 'Unexpected early monsoon onset caused solar generation to drop from 380 MW forecast to 57 MW actual across 3 days.',
    aiExplanation: 'The monsoon arrived 11 days ahead of IMD prediction. Cloud cover reached 97% across both Kutch and Banaskantha simultaneously — a rare combined event (typically affects one region at a time). GHI dropped from 820 W/m² to 112 W/m². Wind generation also suppressed due to light pre-monsoon conditions. Total energy deficit over 3 days: 6,840 MWh vs forecast.',
    recommendedAction: 'Activate monsoon-mode operations: disable fixed-tilt tracking, switch to conservative inverter settings. Coordinate with grid operator for extended low-generation period. Review 14-day IMD forecast daily.',
    acknowledged: true, resolved: true,
  },
];

// ─── AGENT EVENTS ─────────────────────────────────────────────────────────────
export function generateAgentEvents(): AgentEvent[] {
  const base = subHours(now, 0.1);
  return [
    {
      id: 'AE-001', timestamp: format(subHours(base, 0.005), "HH:mm:ss"),
      agentId: 'weather-agent', agentName: 'Weather Agent',
      action: 'Analyzed regional weather data',
      input: 'Kutch + Banaskantha weather — temperature, wind, irradiance, cloud cover, dust index',
      result: 'Wind speed 8.4 m/s; Solar irradiance 812 W/m²; Cloud cover 18%; Forecast: cloud increase after 14:00. Dust index: MODERATE (elevated — monitor SF-06)',
      nextAgent: 'Generation Forecast Agent', severity: 'info',
    },
    {
      id: 'AE-002', timestamp: format(subHours(base, 0.004), "HH:mm:ss"),
      agentId: 'forecast-agent', agentName: 'Generation Forecast Agent',
      action: 'Updated solar and wind generation forecast',
      input: 'Weather data from Weather Agent + historical generation patterns + edge case model',
      result: 'Solar peak forecast: 485 MW at 12:30. Wind steady at 28–32 MW. Total daily: 4,280 MWh. Cloud effect post-14:00 modeled. HIGH WIND alert flag set for T+48h (26 m/s forecast).',
      nextAgent: 'Performance Agent', severity: 'info',
    },
    {
      id: 'AE-003', timestamp: format(subHours(base, 0.003), "HH:mm:ss"),
      agentId: 'performance-agent', agentName: 'Performance Agent',
      action: 'Detected WT-07 anomaly — output 18% below forecast',
      input: 'Live asset telemetry vs forecast. SF-06 dust impact flagged. WT-10 telemetry gap detected.',
      result: 'WT-07: actual 1.68 MW vs expected 2.05 MW. Vibration 0.89 (threshold: 0.65). HY-03 thermal derating active. SF-06 irradiance collapse confirmed (dust storm). WT-10: data gap — 4h 22m.',
      nextAgent: 'Predictive Maintenance Agent', severity: 'warning',
    },
    {
      id: 'AE-004', timestamp: format(subHours(base, 0.002), "HH:mm:ss"),
      agentId: 'maintenance-agent', agentName: 'Predictive Maintenance Agent',
      action: 'Assessed multiple failure risks — WT-07 HIGH, HY-03 HIGH, SF-06 CRITICAL',
      input: 'Asset telemetry from Performance Agent + vibration trends + thermal readings',
      result: 'WT-07 health 61% — gearbox, 72% failure risk, 2–4 days. HY-03 thermal 78% risk, within 12h. SF-06 CRITICAL — emergency cleaning required. WT-10 comms failure — field dispatch needed.',
      nextAgent: 'Grid Optimization Agent', severity: 'warning',
    },
    {
      id: 'AE-005', timestamp: format(subHours(base, 0.0015), "HH:mm:ss"),
      agentId: 'grid-agent', agentName: 'Grid Optimization Agent',
      action: 'Evaluated grid impact — curtailment risk + blackout history + high wind forecast',
      input: 'Generation forecast (485 MW solar peak), multiple asset deficits, grid capacity (440 MW export)',
      result: 'Curtailment risk: 45 MW at 12:30. T+48h high wind will cut 20 MW suddenly — pre-notify SLDC. SF-06 + HY-03 deficits: -62 MW combined. Grid frequency nominal at 50.01 Hz. Recommend pre-charge storage now.',
      nextAgent: 'Dashboard Agent', severity: 'warning',
    },
    {
      id: 'AE-006', timestamp: format(subHours(base, 0.001), "HH:mm:ss"),
      agentId: 'dashboard-agent', agentName: 'Dashboard Agent',
      action: 'Generated operator priorities and executive summary — 4 active edge cases',
      input: 'All agent outputs — weather, forecast, performance, maintenance, grid',
      result: 'P1: WT-07 gearbox inspection 2–4 days. P2: HY-03 thermal — act within 12h. P3: SF-06 dust emergency cleaning. P4: WT-10 comms restore. P5: Curtailment mitigation by 11:00. 3 CRITICAL, 2 HIGH alerts active.',
      severity: 'warning',
    },
  ];
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────
export const agents: Agent[] = [
  {
    id: 'weather-agent', name: 'Weather Agent',
    description: 'Analyzes regional weather conditions — temperature, irradiance, wind, dust index, and extreme weather events',
    status: 'completed', lastRun: format(subHours(now, 0.1), "HH:mm:ss"),
    analysisCount: 1247, alertsGenerated: 23,
  },
  {
    id: 'forecast-agent', name: 'Generation Forecast Agent',
    description: 'Predicts solar and wind generation using weather data, historical patterns, and edge-case event models',
    status: 'completed', lastRun: format(subHours(now, 0.09), "HH:mm:ss"),
    analysisCount: 1244, alertsGenerated: 31,
  },
  {
    id: 'performance-agent', name: 'Asset Performance Agent',
    description: 'Monitors 19 assets, detects anomalies, identifies communication losses, thermal derating, and dust impacts',
    status: 'warning', lastRun: format(subHours(now, 0.08), "HH:mm:ss"),
    analysisCount: 1241, alertsGenerated: 87,
  },
  {
    id: 'maintenance-agent', name: 'Predictive Maintenance Agent',
    description: 'Analyzes sensor data to predict equipment failures across all failure modes: mechanical, thermal, electrical, and communication',
    status: 'completed', lastRun: format(subHours(now, 0.07), "HH:mm:ss"),
    analysisCount: 1238, alertsGenerated: 52,
  },
  {
    id: 'grid-agent', name: 'Grid Optimization Agent',
    description: 'Manages grid integration, evaluates export/storage decisions, handles emergency curtailment, and frequency deviation events',
    status: 'completed', lastRun: format(subHours(now, 0.06), "HH:mm:ss"),
    analysisCount: 1235, alertsGenerated: 19,
  },
  {
    id: 'dashboard-agent', name: 'Dashboard Agent',
    description: 'Orchestrates all agent outputs and provides unified executive summaries and prioritized operator recommendations',
    status: 'completed', lastRun: format(subHours(now, 0.05), "HH:mm:ss"),
    analysisCount: 1232, alertsGenerated: 142,
  },
];

// ─── CURRENT WEATHER ──────────────────────────────────────────────────────────
export const currentWeather: WeatherData = {
  timestamp: now.toISOString(),
  region: 'Kutch',
  temperature: 38.4,
  windSpeed: 8.4,
  windDirection: 'NW',
  solarIrradiance: 812,
  cloudCover: 18,
  humidity: 42,
  rainProbability: 5,
  feelsLike: 41.2,
};

// ─── EDGE CASE SCENARIO DEFINITIONS ─────────────────────────────────────────
// Used by Home.tsx to display the full scenario catalogue
export const edgeCaseScenarios = [
  {
    id: 'EC-01',
    title: 'Dust Storm — Panel Irradiance Collapse',
    asset: 'SF-06 Rann Solar Station',
    region: 'Kutch',
    color: '#f59e0b',
    icon: '🌪️',
    trigger: 'SW winds 22 m/s, PM10 > 2400 µg/m³',
    impact: 'Solar output dropped from 83 MW → 18 MW in 40 min (-78%)',
    aiResponse: 'Weather Agent detected particulate spike → Performance Agent confirmed output collapse → Maintenance Agent flagged tracker motor damage → Grid Agent issued curtailment pre-notice to SLDC',
    resolution: 'Halt trackers, dispatch cleaning crew, notify grid operator within 15 min',
    severity: 'CRITICAL' as const,
  },
  {
    id: 'EC-02',
    title: 'Thermal Runaway — Battery Inverter Overheating',
    asset: 'HY-03 Bhuj Hybrid Storage Complex',
    region: 'Kutch',
    color: '#f85149',
    icon: '🌡️',
    trigger: 'Ambient 49°C + HVAC filter blockage during peak charge',
    impact: 'Inverter temp 58.3°C (limit 55°C), 3 strings derated to 40%, thermal shutdown in 18 min',
    aiResponse: 'Performance Agent detected thermal anomaly → Maintenance Agent escalated to CRITICAL within 2 min → Grid Agent recalculated storage availability → Dashboard Agent issued immediate operator alert',
    resolution: 'Reduce charge rate, disable affected strings, inspect HVAC unit 2 filter',
    severity: 'CRITICAL' as const,
  },
  {
    id: 'EC-03',
    title: 'Communication Loss — Turbine Goes Dark',
    asset: 'WT-10 Bhuj Offshore Wind',
    region: 'Kutch',
    color: '#58a6ff',
    icon: '📡',
    trigger: 'SCADA gateway network card failure, 4h 22m data gap',
    impact: 'Cannot confirm operational state — potential 13.6 MWh revenue gap or undetected fault',
    aiResponse: 'Performance Agent flagged telemetry timeout after 15 min → Dashboard Agent cross-checked SLDC generation reports → Maintenance Agent recommended field dispatch + secondary OOB reboot attempt',
    resolution: 'Remote gateway reboot via OOB channel, field engineer dispatch if unsuccessful',
    severity: 'HIGH' as const,
  },
  {
    id: 'EC-04',
    title: 'Grid Blackout — Forced Zero Export',
    asset: 'All Assets — Bhuj–Surendranagar 220kV Line',
    region: 'Kutch + Banaskantha',
    color: '#e3b341',
    icon: '⚡',
    trigger: 'SLDC emergency curtailment order — 220kV transmission line fault',
    impact: '412 MW curtailed over 3 hours, ₹28.4 lakh/hour revenue loss',
    aiResponse: 'Grid Agent detected frequency deviation (49.3 Hz) 8 sec before SLDC notification → Immediately calculated curtailment volume → Storage pre-charge maximized → Solar trackers angled to 50%',
    resolution: 'Maximize storage charging, reduce generation stress, await SLDC line restoration',
    severity: 'CRITICAL' as const,
  },
  {
    id: 'EC-05',
    title: 'High Wind Over-Speed — Turbine Cut-Out',
    asset: 'WT-01 through WT-09 Kutch Wind Corridor',
    region: 'Kutch',
    color: '#38bdf8',
    icon: '💨',
    trigger: 'Western disturbance — 26–31 m/s sustained winds forecast at T+48h',
    impact: 'Automatic cut-out at 25 m/s for 9 turbines — potential 18–22 MWh loss',
    aiResponse: 'Weather Agent raised HIGH WIND flag 48h in advance → Forecast Agent modeled sudden 20 MW drop scenario → Grid Agent pre-notified SLDC → Maintenance Agent reviewed WT-05 pitch control for high-wind risk',
    resolution: 'Pre-position crews, alert grid operator, monitor WT-05 pitch control firmware',
    severity: 'HIGH' as const,
  },
  {
    id: 'EC-06',
    title: 'Monsoon Surge — 85% Solar Generation Loss',
    asset: 'All Solar Assets — Kutch + Banaskantha',
    region: 'Kutch + Banaskantha',
    color: '#a78bfa',
    icon: '🌧️',
    trigger: 'Monsoon onset 11 days early, GHI dropped from 820 to 112 W/m²',
    impact: '6,840 MWh deficit over 3 days vs forecast — both regions affected simultaneously',
    aiResponse: 'Weather Agent detected cloud cover surge to 97% across both regions → Forecast Agent revised 7-day forecast immediately → Grid Agent coordinated with SLDC for extended low-generation period → Dashboard Agent activated monsoon-mode operations protocol',
    resolution: 'Monsoon-mode operations, conservative inverter settings, daily IMD forecast review',
    severity: 'HIGH' as const,
  },
];
