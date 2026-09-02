import { subHours, addHours, format } from 'date-fns';

const now = new Date();

export const assets = [
  { assetId: 'SF-01', name: 'Kutch Solar Farm Alpha', type: 'solar', region: 'Kutch', capacityMW: 150, currentOutputMW: 132.4, expectedOutputMW: 140.2, efficiency: 94.4, healthScore: 91, status: 'online', riskLevel: 'LOW', temperature: 38.2, vibration: 0.12, lastMaintenance: '2024-11-15', nextMaintenance: '2025-03-15', operatingHours: 18420 },
  { assetId: 'SF-02', name: 'Mundra Solar Park', type: 'solar', region: 'Kutch', capacityMW: 200, currentOutputMW: 171.8, expectedOutputMW: 185.0, efficiency: 92.9, healthScore: 87, status: 'warning', riskLevel: 'MEDIUM', temperature: 41.6, vibration: 0.18, lastMaintenance: '2024-10-08', nextMaintenance: '2025-02-08', operatingHours: 21340 },
  { assetId: 'SF-03', name: 'Nakhatrana Solar Station', type: 'solar', region: 'Kutch', capacityMW: 100, currentOutputMW: 94.7, expectedOutputMW: 96.0, efficiency: 98.6, healthScore: 96, status: 'online', riskLevel: 'LOW', temperature: 36.8, vibration: 0.09, lastMaintenance: '2024-12-01', nextMaintenance: '2025-06-01', operatingHours: 12080 },
  { assetId: 'SF-04', name: 'Deesa Solar Array', type: 'solar', region: 'Banaskantha', capacityMW: 80, currentOutputMW: 67.2, expectedOutputMW: 74.8, efficiency: 89.8, healthScore: 78, status: 'warning', riskLevel: 'MEDIUM', temperature: 43.1, vibration: 0.22, lastMaintenance: '2024-09-12', nextMaintenance: '2025-01-20', operatingHours: 24500 },
  { assetId: 'SF-05', name: 'Palanpur Solar Complex', type: 'solar', region: 'Banaskantha', capacityMW: 120, currentOutputMW: 104.3, expectedOutputMW: 112.8, efficiency: 92.5, healthScore: 88, status: 'online', riskLevel: 'LOW', temperature: 39.4, vibration: 0.14, lastMaintenance: '2024-11-28', nextMaintenance: '2025-05-28', operatingHours: 15620 },
  { assetId: 'WT-01', name: 'Kutch Wind Turbine 01', type: 'wind', region: 'Kutch', capacityMW: 2.5, currentOutputMW: 2.31, expectedOutputMW: 2.28, efficiency: 101.3, healthScore: 95, status: 'online', riskLevel: 'LOW', temperature: 34.2, vibration: 0.31, rpm: 14.8, lastMaintenance: '2024-12-01', nextMaintenance: '2025-06-01', operatingHours: 9840 },
  { assetId: 'WT-02', name: 'Kutch Wind Turbine 02', type: 'wind', region: 'Kutch', capacityMW: 2.5, currentOutputMW: 2.18, expectedOutputMW: 2.28, efficiency: 95.6, healthScore: 89, status: 'online', riskLevel: 'LOW', temperature: 35.1, vibration: 0.38, rpm: 14.2, lastMaintenance: '2024-11-15', nextMaintenance: '2025-05-15', operatingHours: 11200 },
  { assetId: 'WT-03', name: 'Kutch Wind Turbine 03', type: 'wind', region: 'Kutch', capacityMW: 2.5, currentOutputMW: 2.29, expectedOutputMW: 2.28, efficiency: 100.4, healthScore: 94, status: 'online', riskLevel: 'LOW', temperature: 33.8, vibration: 0.29, rpm: 14.9, lastMaintenance: '2024-12-10', nextMaintenance: '2025-06-10', operatingHours: 8960 },
  { assetId: 'WT-04', name: 'Bhuj Wind Farm T-04', type: 'wind', region: 'Kutch', capacityMW: 3.0, currentOutputMW: 2.74, expectedOutputMW: 2.82, efficiency: 97.2, healthScore: 90, status: 'online', riskLevel: 'LOW', temperature: 35.6, vibration: 0.34, rpm: 13.6, lastMaintenance: '2024-10-20', nextMaintenance: '2025-04-20', operatingHours: 14320 },
  { assetId: 'WT-05', name: 'Bhuj Wind Farm T-05', type: 'wind', region: 'Kutch', capacityMW: 3.0, currentOutputMW: 2.31, expectedOutputMW: 2.82, efficiency: 81.9, healthScore: 72, status: 'warning', riskLevel: 'MEDIUM', temperature: 39.2, vibration: 0.68, rpm: 11.8, lastMaintenance: '2024-09-05', nextMaintenance: '2025-01-10', operatingHours: 19640 },
  { assetId: 'WT-06', name: 'Banaskantha Wind T-06', type: 'wind', region: 'Banaskantha', capacityMW: 2.5, currentOutputMW: 2.11, expectedOutputMW: 2.28, efficiency: 92.5, healthScore: 84, status: 'online', riskLevel: 'LOW', temperature: 36.4, vibration: 0.41, rpm: 13.9, lastMaintenance: '2024-11-01', nextMaintenance: '2025-05-01', operatingHours: 16200 },
  { assetId: 'WT-07', name: 'Banaskantha Wind T-07', type: 'wind', region: 'Banaskantha', capacityMW: 2.5, currentOutputMW: 1.68, expectedOutputMW: 2.05, efficiency: 82.0, healthScore: 61, status: 'warning', riskLevel: 'HIGH', temperature: 42.8, vibration: 0.89, rpm: 10.4, lastMaintenance: '2024-08-14', nextMaintenance: '2025-01-05', operatingHours: 27800 },
  { assetId: 'WT-08', name: 'Banaskantha Wind T-08', type: 'wind', region: 'Banaskantha', capacityMW: 2.5, currentOutputMW: 0.0, expectedOutputMW: 2.28, efficiency: 0.0, healthScore: 22, status: 'maintenance', riskLevel: 'CRITICAL', temperature: 28.1, vibration: 0.0, rpm: 0.0, lastMaintenance: '2025-01-02', nextMaintenance: '2025-01-15', operatingHours: 31200 },
  { assetId: 'WT-09', name: 'Deesa Wind Station T-09', type: 'wind', region: 'Banaskantha', capacityMW: 2.0, currentOutputMW: 1.88, expectedOutputMW: 1.92, efficiency: 97.9, healthScore: 93, status: 'online', riskLevel: 'LOW', temperature: 33.9, vibration: 0.27, rpm: 15.1, lastMaintenance: '2024-12-15', nextMaintenance: '2025-06-15', operatingHours: 7840 },
  { assetId: 'HY-01', name: 'Kutch Hybrid Energy Station', type: 'hybrid', region: 'Kutch', capacityMW: 75, currentOutputMW: 64.8, expectedOutputMW: 68.4, efficiency: 94.7, healthScore: 89, status: 'online', riskLevel: 'LOW', temperature: 37.6, vibration: 0.19, lastMaintenance: '2024-11-20', nextMaintenance: '2025-05-20', operatingHours: 13400 },
  { assetId: 'HY-02', name: 'Banaskantha Hybrid Park', type: 'hybrid', region: 'Banaskantha', capacityMW: 50, currentOutputMW: 38.9, expectedOutputMW: 46.5, efficiency: 83.7, healthScore: 74, status: 'warning', riskLevel: 'MEDIUM', temperature: 44.3, vibration: 0.31, lastMaintenance: '2024-09-28', nextMaintenance: '2025-01-28', operatingHours: 20100 },
];

export function getGenerationHistory(hours = 72) {
  const records = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const h = ts.getHours();
    const isDaytime = h >= 6 && h <= 18;
    const solar = isDaytime ? Math.max(0, 380 + Math.sin((h - 6) * Math.PI / 12) * 200 + (Math.random() - 0.5) * 30) : 0;
    const wind = 25 + Math.sin(i * 0.3) * 7 + Math.random() * 4;
    const total = solar + wind;
    const expected = (isDaytime ? 380 + Math.sin((h - 6) * Math.PI / 12) * 200 : 0) + 28;
    records.push({ timestamp: ts.toISOString(), solarMW: +solar.toFixed(1), windMW: +wind.toFixed(1), totalMW: +total.toFixed(1), expectedMW: +Math.max(0, expected).toFixed(1) });
  }
  return records;
}

export function getGenerationForecast(hours = 72) {
  const records = [];
  for (let h = 0; h <= hours; h++) {
    const ts = addHours(now, h);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const cloudEffect = h > 36 ? 0.88 : 1.0;
    const solar = isDaytime ? Math.max(0, (380 + Math.sin((hour - 6) * Math.PI / 12) * 200) * cloudEffect) : 0;
    const wind = 26 + Math.sin(h * 0.3) * 7 + Math.random() * 3;
    const total = solar + wind;
    records.push({ timestamp: ts.toISOString(), solarMW: +solar.toFixed(1), windMW: +wind.toFixed(1), totalMW: +total.toFixed(1), confidenceLow: +(total * 0.92).toFixed(1), confidenceHigh: +(total * 1.08).toFixed(1), weatherImpact: h > 36 ? 'Cloud cover — 12% solar reduction' : 'Clear conditions' });
  }
  return records;
}

export function getWeatherData(hours = 48) {
  const records = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const h = ts.getHours();
    const isDaytime = h >= 6 && h <= 18;
    records.push({ timestamp: ts.toISOString(), region: 'Kutch', temperature: +(32 + Math.sin((h - 6) * Math.PI / 12) * 8 + (Math.random() - 0.5) * 2).toFixed(1), windSpeed: +(6 + Math.sin(i * 0.3) * 3 + Math.random() * 2).toFixed(1), windDirection: ['NW', 'NNW', 'N', 'W'][Math.floor(Math.random() * 4)], solarIrradiance: isDaytime ? +(600 + Math.sin((h - 6) * Math.PI / 12) * 350 + (Math.random() - 0.5) * 40).toFixed(0) : 0, cloudCover: +(10 + Math.random() * 30).toFixed(0), humidity: +(35 + Math.random() * 20).toFixed(0), rainProbability: +(Math.random() * 15).toFixed(0) });
  }
  return records;
}

export function getGridData(hours = 48) {
  const records = [];
  for (let i = hours; i >= 0; i--) {
    const ts = subHours(now, i);
    const h = ts.getHours();
    const isDaytime = h >= 6 && h <= 18;
    const solar = isDaytime ? 300 + Math.sin((h - 6) * Math.PI / 12) * 160 : 0;
    const wind = 25 + Math.sin(i * 0.3) * 6 + Math.random() * 4;
    const total = solar + wind;
    const demand = 280 + Math.sin((h - 8) * Math.PI / 10) * 60 + Math.random() * 20;
    const surplus = Math.max(0, total - demand);
    const exportMW = Math.min(surplus, 40);
    const storageMW = Math.min(surplus - exportMW, 30);
    records.push({ timestamp: ts.toISOString(), generationMW: +total.toFixed(1), demandMW: +demand.toFixed(1), exportMW: +exportMW.toFixed(1), storageMW: +storageMW.toFixed(1), curtailmentMW: +Math.max(0, surplus - exportMW - storageMW).toFixed(1), gridFrequency: +(49.9 + Math.random() * 0.2).toFixed(2) });
  }
  return records;
}

export const maintenanceRecords = [
  { id: 'M-001', assetId: 'WT-08', assetName: 'Banaskantha Wind T-08', assetType: 'wind', healthScore: 22, failureRisk: 96, riskLevel: 'CRITICAL', issue: 'Complete drivetrain failure — turbine taken offline', recommendation: 'Emergency replacement of main bearing and gearbox', estimatedWindow: 'Immediate — 7–14 days', component: 'Main Bearing / Gearbox', lastInspection: '2025-01-02' },
  { id: 'M-002', assetId: 'WT-07', assetName: 'Banaskantha Wind T-07', assetType: 'wind', healthScore: 61, failureRisk: 72, riskLevel: 'HIGH', issue: 'Gearbox vibration 23% above baseline — power output 18% below expected', recommendation: 'Inspect gearbox assembly; check oil levels and bearing wear', estimatedWindow: '2–4 days', component: 'Gearbox', lastInspection: '2024-08-14' },
  { id: 'M-003', assetId: 'SF-04', assetName: 'Deesa Solar Array', assetType: 'solar', healthScore: 78, failureRisk: 48, riskLevel: 'MEDIUM', issue: 'Rising inverter temperature — 9% efficiency drop over 7 days', recommendation: 'Clean cooling fins; inspect inverter fans and thermal management', estimatedWindow: '5–7 days', component: 'Solar Inverter INV-12', lastInspection: '2024-09-12' },
  { id: 'M-004', assetId: 'WT-05', assetName: 'Bhuj Wind Farm T-05', assetType: 'wind', healthScore: 72, failureRisk: 41, riskLevel: 'MEDIUM', issue: 'Vibration trending upward — RPM below rated curve', recommendation: 'Blade inspection and pitch control system check', estimatedWindow: '7–10 days', component: 'Blade / Pitch Control', lastInspection: '2024-09-05' },
  { id: 'M-005', assetId: 'HY-02', assetName: 'Banaskantha Hybrid Park', assetType: 'hybrid', healthScore: 74, failureRisk: 38, riskLevel: 'MEDIUM', issue: 'Aging string inverters — efficiency at 83.7% vs 91% design target', recommendation: 'Schedule inverter replacement; inspect DC/AC conversion units', estimatedWindow: '10–14 days', component: 'String Inverters', lastInspection: '2024-09-28' },
  { id: 'M-006', assetId: 'SF-02', assetName: 'Mundra Solar Park', assetType: 'solar', healthScore: 87, failureRisk: 22, riskLevel: 'LOW', issue: 'Panel surface soiling detected — minor efficiency reduction', recommendation: 'Schedule panel cleaning during next maintenance window', estimatedWindow: '14–21 days', component: 'PV Panels', lastInspection: '2024-10-08' },
  { id: 'M-007', assetId: 'WT-06', assetName: 'Banaskantha Wind T-06', assetType: 'wind', healthScore: 84, failureRisk: 19, riskLevel: 'LOW', issue: 'Minor lubrication interval due — routine maintenance', recommendation: 'Perform standard lubrication and sensor calibration', estimatedWindow: '21–30 days', component: 'Main Shaft Bearings', lastInspection: '2024-11-01' },
];

export const alertsData = [
  { id: 'ALT-001', severity: 'critical', category: 'maintenance', assetId: 'WT-08', assetName: 'Banaskantha Wind T-08', timestamp: format(subHours(now, 2), "yyyy-MM-dd'T'HH:mm:ss"), title: 'Critical Failure — Turbine Offline', problem: 'WT-08 has experienced a complete drivetrain failure and is currently offline.', aiExplanation: 'Rapid bearing temperature increase to 94°C triggered automatic protection shutdown. Vibration exceeded safety threshold 3× in the preceding 4 hours. Failure probability was at 96% — emergency shutdown was appropriate.', recommendedAction: 'Dispatch maintenance crew immediately. Estimated repair window: 7–14 days.', acknowledged: true, resolved: false },
  { id: 'ALT-002', severity: 'high', category: 'performance', assetId: 'WT-07', assetName: 'Banaskantha Wind T-07', timestamp: format(subHours(now, 0.5), "yyyy-MM-dd'T'HH:mm:ss"), title: 'WT-07 Output 18% Below Expected', problem: 'Wind Turbine WT-07 is producing 18% below expected output under current wind conditions.', aiExplanation: 'Vibration has increased 23% above baseline over the past 72 hours. RPM is 10.4 vs rated 15.2. Possible causes: gearbox efficiency degradation or pitch control anomaly. Health score has dropped from 81% to 61% in 7 days.', recommendedAction: 'Schedule gearbox inspection within 2–4 days. Reduce load on WT-07 cluster if generation margin allows.', acknowledged: false, resolved: false },
  { id: 'ALT-003', severity: 'high', category: 'maintenance', assetId: 'SF-04', assetName: 'Deesa Solar Array', timestamp: format(subHours(now, 1), "yyyy-MM-dd'T'HH:mm:ss"), title: 'Inverter Temperature Trending High', problem: 'Solar Inverter INV-12 at Deesa Solar Array shows a sustained temperature increase.', aiExplanation: 'Inverter temperature has increased from 42°C to 51°C over 7 days. Efficiency has dropped 9% in parallel. This thermal trend indicates cooling system failure or fan blockage.', recommendedAction: 'Inspect inverter cooling system within 72 hours. Clean cooling fins and test thermal management.', acknowledged: false, resolved: false },
  { id: 'ALT-004', severity: 'warning', category: 'grid', assetId: null, assetName: null, timestamp: format(subHours(now, 0.25), "yyyy-MM-dd'T'HH:mm:ss"), title: 'Curtailment Risk — Solar Peak Generation', problem: 'High solar generation forecast for 11:30–14:30 may exceed grid export capacity.', aiExplanation: 'Combined solar generation projected to reach 485 MW between 11:30–14:30, exceeding available grid export capacity of 440 MW. Without action, approximately 45 MW may need to be curtailed.', recommendedAction: 'Pre-charge storage systems by 11:00. Maximize export to 440 MW. Alert grid operator for capacity coordination.', acknowledged: false, resolved: false },
  { id: 'ALT-005', severity: 'warning', category: 'weather', assetId: null, assetName: null, timestamp: format(subHours(now, 0.1), "yyyy-MM-dd'T'HH:mm:ss"), title: 'Cloud Cover Forecast After 14:00', problem: 'Increased cloud cover expected after 14:00, affecting solar output.', aiExplanation: 'Weather forecast shows cloud coverage increasing from 18% to 64% between 14:00–17:00. Solar irradiance expected to drop from 820 W/m² to 340 W/m². Impact: 11–16% reduction in total generation.', recommendedAction: 'Coordinate grid dispatch to account for reduced solar output post-14:00. Increase wind turbine availability to offset.', acknowledged: false, resolved: false },
];
