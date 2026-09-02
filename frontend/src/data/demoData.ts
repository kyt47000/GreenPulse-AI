import { Asset, WeatherData, GenerationRecord, GenerationForecast, MaintenanceRecord, GridRecord, Alert, AgentEvent, Agent } from '../types';
import { subHours, subDays, addHours, format } from 'date-fns';

const now = new Date();

// ─── ASSETS ──────────────────────────────────────────────────────────────────
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
];

// ─── WEATHER DATA ─────────────────────────────────────────────────────────────
export function generateWeatherData(hours = 48): WeatherData[] {
  const data: WeatherData[] = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    data.push({
      timestamp: ts.toISOString(),
      region: 'Kutch',
      temperature: 32 + Math.sin((hour - 6) * Math.PI / 12) * 8 + (Math.random() - 0.5) * 2,
      windSpeed: 6 + Math.sin(i * 0.3) * 3 + Math.random() * 2,
      windDirection: ['NW', 'NNW', 'N', 'NE', 'W'][Math.floor(Math.random() * 5)],
      solarIrradiance: isDaytime ? 600 + Math.sin((hour - 6) * Math.PI / 12) * 350 + (Math.random() - 0.5) * 50 : 0,
      cloudCover: 10 + Math.random() * 30,
      humidity: 35 + Math.random() * 20,
      rainProbability: Math.random() * 15,
      feelsLike: 35 + Math.sin((hour - 6) * Math.PI / 12) * 7,
    });
  }
  return data;
}

// ─── GENERATION HISTORY ───────────────────────────────────────────────────────
export function generateHistoricalGeneration(days = 30): GenerationRecord[] {
  const data: GenerationRecord[] = [];
  for (let d = days; d >= 0; d--) {
    for (let h = 0; h < 24; h++) {
      const ts = subHours(now, d * 24 + (24 - h));
      const isDaytime = h >= 6 && h <= 18;
      const solarBase = isDaytime ? 380 + Math.sin((h - 6) * Math.PI / 12) * 200 : 0;
      const solar = Math.max(0, solarBase + (Math.random() - 0.5) * 40);
      const wind = 25 + Math.sin(d * 0.5) * 8 + Math.random() * 6;
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
    // Simulate cloud effect after hour 36
    const cloudEffect = h > 36 ? 0.88 : 1.0;
    const solar = Math.max(0, solarBase * cloudEffect + (Math.random() - 0.5) * 20);
    const wind = 26 + Math.sin(h * 0.3) * 7 + Math.random() * 4;
    const total = solar + wind;
    const variance = total * 0.08;
    data.push({
      timestamp: ts.toISOString(),
      solarMW: parseFloat(solar.toFixed(1)),
      windMW: parseFloat(wind.toFixed(1)),
      totalMW: parseFloat(total.toFixed(1)),
      confidenceLow: parseFloat(Math.max(0, total - variance).toFixed(1)),
      confidenceHigh: parseFloat((total + variance).toFixed(1)),
      weatherImpact: h > 36 ? 'Cloud cover expected — 12% reduction in solar' : 'Clear conditions',
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
];

// ─── GRID DATA ────────────────────────────────────────────────────────────────
export function generateGridData(hours = 48): GridRecord[] {
  const data: GridRecord[] = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const solarGen = isDaytime ? 300 + Math.sin((hour - 6) * Math.PI / 12) * 160 : 0;
    const windGen = 25 + Math.sin(i * 0.3) * 6 + Math.random() * 4;
    const totalGen = solarGen + windGen;
    const demand = 280 + Math.sin((hour - 8) * Math.PI / 10) * 60 + Math.random() * 20;
    const surplus = Math.max(0, totalGen - demand);
    const exportMW = Math.min(surplus, 40);
    const storageMW = Math.min(surplus - exportMW, 30);
    const curtailmentMW = Math.max(0, surplus - exportMW - storageMW);
    data.push({
      timestamp: ts.toISOString(),
      generationMW: parseFloat(totalGen.toFixed(1)),
      demandMW: parseFloat(demand.toFixed(1)),
      exportMW: parseFloat(exportMW.toFixed(1)),
      storageMW: parseFloat(storageMW.toFixed(1)),
      curtailmentMW: parseFloat(curtailmentMW.toFixed(1)),
      gridFrequency: 49.9 + Math.random() * 0.2,
    });
  }
  return data;
}

// ─── ALERTS ───────────────────────────────────────────────────────────────────
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
    title: 'Panel Efficiency Below Optimal',
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
];

// ─── AGENT EVENTS ─────────────────────────────────────────────────────────────
export function generateAgentEvents(): AgentEvent[] {
  const base = subHours(now, 0.1);
  return [
    {
      id: 'AE-001', timestamp: format(subHours(base, 0.005), "HH:mm:ss"),
      agentId: 'weather-agent', agentName: 'Weather Agent',
      action: 'Analyzed regional weather data',
      input: 'Kutch + Banaskantha weather APIs — temperature, wind, irradiance, cloud cover',
      result: 'Wind speed 8.4 m/s; Solar irradiance 812 W/m²; Cloud cover 18%; Forecast: cloud increase after 14:00',
      nextAgent: 'Generation Forecast Agent', severity: 'info',
    },
    {
      id: 'AE-002', timestamp: format(subHours(base, 0.004), "HH:mm:ss"),
      agentId: 'forecast-agent', agentName: 'Generation Forecast Agent',
      action: 'Updated solar and wind generation forecast',
      input: 'Weather data from Weather Agent + historical generation patterns',
      result: 'Solar peak forecast: 485 MW at 12:30. Wind steady at 28–32 MW. Total daily: 4,280 MWh. Cloud effect post-14:00 modeled.',
      nextAgent: 'Performance Agent', severity: 'info',
    },
    {
      id: 'AE-003', timestamp: format(subHours(base, 0.003), "HH:mm:ss"),
      agentId: 'performance-agent', agentName: 'Performance Agent',
      action: 'Detected WT-07 anomaly — output 18% below forecast',
      input: 'Live asset telemetry vs forecast from Generation Forecast Agent',
      result: 'WT-07: actual 1.68 MW vs expected 2.05 MW. Vibration 0.89 (threshold: 0.65). Temperature 42.8°C (rising). Health score: 61%.',
      nextAgent: 'Predictive Maintenance Agent', severity: 'warning',
    },
    {
      id: 'AE-004', timestamp: format(subHours(base, 0.002), "HH:mm:ss"),
      agentId: 'maintenance-agent', agentName: 'Predictive Maintenance Agent',
      action: 'Assessed WT-07 failure risk — assigned HIGH risk level',
      input: 'Asset telemetry, vibration trend (7-day), operating hours: 27,800h from Performance Agent',
      result: 'Health score: 61%. Failure risk: 72%. Gearbox degradation pattern detected. Estimated maintenance urgency: 2–4 days. Risk level: HIGH.',
      nextAgent: 'Grid Optimization Agent', severity: 'warning',
    },
    {
      id: 'AE-005', timestamp: format(subHours(base, 0.0015), "HH:mm:ss"),
      agentId: 'grid-agent', agentName: 'Grid Optimization Agent',
      action: 'Evaluated grid impact of peak solar + WT-07 underperformance',
      input: 'Generation forecast (485 MW solar peak), WT-07 deficit (-0.37 MW), grid capacity (440 MW export)',
      result: 'Curtailment risk: 45 MW at 12:30. Recommendation: maximize export, pre-charge storage by 11:00. WT-07 deficit impact: minor at grid scale.',
      nextAgent: 'Dashboard Agent', severity: 'warning',
    },
    {
      id: 'AE-006', timestamp: format(subHours(base, 0.001), "HH:mm:ss"),
      agentId: 'dashboard-agent', agentName: 'Dashboard Agent',
      action: 'Generated operator priorities and executive summary',
      input: 'All agent outputs — weather, forecast, performance, maintenance, grid',
      result: 'Priority 1: WT-07 gearbox inspection (2–4 days). Priority 2: Curtailment risk mitigation by 11:00. Priority 3: Inverter check at Deesa Solar. 2 HIGH alerts, 1 CRITICAL asset offline.',
      severity: 'warning',
    },
  ];
}

// ─── AGENTS ───────────────────────────────────────────────────────────────────
export const agents: Agent[] = [
  {
    id: 'weather-agent', name: 'Weather Agent',
    description: 'Analyzes regional weather conditions and generates weather impact assessments for renewable generation',
    status: 'completed', lastRun: format(subHours(now, 0.1), "HH:mm:ss"),
    analysisCount: 1247, alertsGenerated: 23,
  },
  {
    id: 'forecast-agent', name: 'Generation Forecast Agent',
    description: 'Predicts solar and wind generation using weather data and historical patterns',
    status: 'completed', lastRun: format(subHours(now, 0.09), "HH:mm:ss"),
    analysisCount: 1244, alertsGenerated: 31,
  },
  {
    id: 'performance-agent', name: 'Asset Performance Agent',
    description: 'Continuously monitors asset performance, detects anomalies, and identifies underperforming equipment',
    status: 'warning', lastRun: format(subHours(now, 0.08), "HH:mm:ss"),
    analysisCount: 1241, alertsGenerated: 87,
  },
  {
    id: 'maintenance-agent', name: 'Predictive Maintenance Agent',
    description: 'Analyzes sensor data to predict equipment failures and schedule maintenance proactively',
    status: 'completed', lastRun: format(subHours(now, 0.07), "HH:mm:ss"),
    analysisCount: 1238, alertsGenerated: 52,
  },
  {
    id: 'grid-agent', name: 'Grid Optimization Agent',
    description: 'Manages grid integration, evaluates export/storage decisions, and mitigates curtailment',
    status: 'completed', lastRun: format(subHours(now, 0.06), "HH:mm:ss"),
    analysisCount: 1235, alertsGenerated: 19,
  },
  {
    id: 'dashboard-agent', name: 'Dashboard Agent',
    description: 'Orchestrates all agent outputs and provides unified executive summaries and operator recommendations',
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
