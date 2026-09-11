// ─── In-memory live asset state, seeded from mockData baseline ───────────────
// The simulator mutates this on every tick. Routes read from here.
// When DATA_SOURCE=ibm-live, the Kafka consumer writes here instead.

export interface LiveAsset {
  assetId: string;
  name: string;
  type: 'solar' | 'wind' | 'hybrid';
  region: string;
  capacityMW: number;
  currentOutputMW: number;
  expectedOutputMW: number;
  efficiency: number;
  healthScore: number;
  status: 'online' | 'offline' | 'warning' | 'maintenance';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  temperature: number;
  vibration: number;
  rpm?: number;
  operatingHours: number;
  lastMaintenance: string;
  nextMaintenance: string;
  lastUpdated: string;
}

export interface LiveWeather {
  timestamp: string;
  region: string;
  temperature: number;
  windSpeed: number;
  windDirection: string;
  solarIrradiance: number;
  cloudCover: number;
  humidity: number;
  rainProbability: number;
  feelsLike: number;
}

export interface LiveGrid {
  timestamp: string;
  generationMW: number;
  demandMW: number;
  exportMW: number;
  storageMW: number;
  curtailmentMW: number;
  gridFrequency: number;
}

export interface LiveState {
  assets: LiveAsset[];
  weather: LiveWeather;
  grid: LiveGrid;
  tickCount: number;
  dataSource: 'simulator' | 'ibm-live';
  lastTick: string;
}

// ─── Seed baseline (mirrors mockData.ts assets) ───────────────────────────────
const seedAssets: LiveAsset[] = [
  { assetId: 'SF-01', name: 'Kutch Solar Farm Alpha',      type: 'solar',  region: 'Kutch',       capacityMW: 150,  currentOutputMW: 132.4, expectedOutputMW: 140.2, efficiency: 94.4,  healthScore: 91, status: 'online',      riskLevel: 'LOW',      temperature: 38.2, vibration: 0.12, operatingHours: 18420, lastMaintenance: '2024-11-15', nextMaintenance: '2025-03-15', lastUpdated: new Date().toISOString() },
  { assetId: 'SF-02', name: 'Mundra Solar Park',           type: 'solar',  region: 'Kutch',       capacityMW: 200,  currentOutputMW: 171.8, expectedOutputMW: 185.0, efficiency: 92.9,  healthScore: 87, status: 'warning',     riskLevel: 'MEDIUM',   temperature: 41.6, vibration: 0.18, operatingHours: 21340, lastMaintenance: '2024-10-08', nextMaintenance: '2025-02-08', lastUpdated: new Date().toISOString() },
  { assetId: 'SF-03', name: 'Nakhatrana Solar Station',    type: 'solar',  region: 'Kutch',       capacityMW: 100,  currentOutputMW: 94.7,  expectedOutputMW: 96.0,  efficiency: 98.6,  healthScore: 96, status: 'online',      riskLevel: 'LOW',      temperature: 36.8, vibration: 0.09, operatingHours: 12080, lastMaintenance: '2024-12-01', nextMaintenance: '2025-06-01', lastUpdated: new Date().toISOString() },
  { assetId: 'SF-04', name: 'Deesa Solar Array',           type: 'solar',  region: 'Banaskantha', capacityMW: 80,   currentOutputMW: 67.2,  expectedOutputMW: 74.8,  efficiency: 89.8,  healthScore: 78, status: 'warning',     riskLevel: 'MEDIUM',   temperature: 43.1, vibration: 0.22, operatingHours: 24500, lastMaintenance: '2024-09-12', nextMaintenance: '2025-01-20', lastUpdated: new Date().toISOString() },
  { assetId: 'SF-05', name: 'Palanpur Solar Complex',      type: 'solar',  region: 'Banaskantha', capacityMW: 120,  currentOutputMW: 104.3, expectedOutputMW: 112.8, efficiency: 92.5,  healthScore: 88, status: 'online',      riskLevel: 'LOW',      temperature: 39.4, vibration: 0.14, operatingHours: 15620, lastMaintenance: '2024-11-28', nextMaintenance: '2025-05-28', lastUpdated: new Date().toISOString() },
  { assetId: 'SF-06', name: 'Rann Solar Station',          type: 'solar',  region: 'Kutch',       capacityMW: 90,   currentOutputMW: 18.2,  expectedOutputMW: 83.7,  efficiency: 21.7,  healthScore: 34, status: 'warning',     riskLevel: 'CRITICAL', temperature: 49.6, vibration: 0.08, operatingHours: 22100, lastMaintenance: '2024-08-01', nextMaintenance: '2025-01-08', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-01', name: 'Kutch Wind Turbine 01',       type: 'wind',   region: 'Kutch',       capacityMW: 2.5,  currentOutputMW: 2.31,  expectedOutputMW: 2.28,  efficiency: 101.3, healthScore: 95, status: 'online',      riskLevel: 'LOW',      temperature: 34.2, vibration: 0.31, rpm: 14.8, operatingHours: 9840,  lastMaintenance: '2024-12-01', nextMaintenance: '2025-06-01', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-02', name: 'Kutch Wind Turbine 02',       type: 'wind',   region: 'Kutch',       capacityMW: 2.5,  currentOutputMW: 2.18,  expectedOutputMW: 2.28,  efficiency: 95.6,  healthScore: 89, status: 'online',      riskLevel: 'LOW',      temperature: 35.1, vibration: 0.38, rpm: 14.2, operatingHours: 11200, lastMaintenance: '2024-11-15', nextMaintenance: '2025-05-15', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-03', name: 'Kutch Wind Turbine 03',       type: 'wind',   region: 'Kutch',       capacityMW: 2.5,  currentOutputMW: 2.29,  expectedOutputMW: 2.28,  efficiency: 100.4, healthScore: 94, status: 'online',      riskLevel: 'LOW',      temperature: 33.8, vibration: 0.29, rpm: 14.9, operatingHours: 8960,  lastMaintenance: '2024-12-10', nextMaintenance: '2025-06-10', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-04', name: 'Bhuj Wind Farm T-04',         type: 'wind',   region: 'Kutch',       capacityMW: 3.0,  currentOutputMW: 2.74,  expectedOutputMW: 2.82,  efficiency: 97.2,  healthScore: 90, status: 'online',      riskLevel: 'LOW',      temperature: 35.6, vibration: 0.34, rpm: 13.6, operatingHours: 14320, lastMaintenance: '2024-10-20', nextMaintenance: '2025-04-20', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-05', name: 'Bhuj Wind Farm T-05',         type: 'wind',   region: 'Kutch',       capacityMW: 3.0,  currentOutputMW: 2.31,  expectedOutputMW: 2.82,  efficiency: 81.9,  healthScore: 72, status: 'warning',     riskLevel: 'MEDIUM',   temperature: 39.2, vibration: 0.68, rpm: 11.8, operatingHours: 19640, lastMaintenance: '2024-09-05', nextMaintenance: '2025-01-10', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-06', name: 'Banaskantha Wind T-06',       type: 'wind',   region: 'Banaskantha', capacityMW: 2.5,  currentOutputMW: 2.11,  expectedOutputMW: 2.28,  efficiency: 92.5,  healthScore: 84, status: 'online',      riskLevel: 'LOW',      temperature: 36.4, vibration: 0.41, rpm: 13.9, operatingHours: 16200, lastMaintenance: '2024-11-01', nextMaintenance: '2025-05-01', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-07', name: 'Banaskantha Wind T-07',       type: 'wind',   region: 'Banaskantha', capacityMW: 2.5,  currentOutputMW: 1.68,  expectedOutputMW: 2.05,  efficiency: 82.0,  healthScore: 61, status: 'warning',     riskLevel: 'HIGH',     temperature: 42.8, vibration: 0.89, rpm: 10.4, operatingHours: 27800, lastMaintenance: '2024-08-14', nextMaintenance: '2025-01-05', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-08', name: 'Banaskantha Wind T-08',       type: 'wind',   region: 'Banaskantha', capacityMW: 2.5,  currentOutputMW: 0.0,   expectedOutputMW: 2.28,  efficiency: 0.0,   healthScore: 22, status: 'maintenance', riskLevel: 'CRITICAL', temperature: 28.1, vibration: 0.0,  rpm: 0.0,  operatingHours: 31200, lastMaintenance: '2025-01-02', nextMaintenance: '2025-01-15', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-09', name: 'Deesa Wind Station T-09',     type: 'wind',   region: 'Banaskantha', capacityMW: 2.0,  currentOutputMW: 1.88,  expectedOutputMW: 1.92,  efficiency: 97.9,  healthScore: 93, status: 'online',      riskLevel: 'LOW',      temperature: 33.9, vibration: 0.27, rpm: 15.1, operatingHours: 7840,  lastMaintenance: '2024-12-15', nextMaintenance: '2025-06-15', lastUpdated: new Date().toISOString() },
  { assetId: 'WT-10', name: 'Bhuj Offshore Wind T-10',     type: 'wind',   region: 'Kutch',       capacityMW: 3.5,  currentOutputMW: 0.0,   expectedOutputMW: 3.2,   efficiency: 0.0,   healthScore: 45, status: 'offline',     riskLevel: 'HIGH',     temperature: 0,    vibration: 0,    rpm: 0,    operatingHours: 17300, lastMaintenance: '2024-10-10', nextMaintenance: '2025-02-10', lastUpdated: new Date().toISOString() },
  { assetId: 'HY-01', name: 'Kutch Hybrid Energy Station', type: 'hybrid', region: 'Kutch',       capacityMW: 75,   currentOutputMW: 64.8,  expectedOutputMW: 68.4,  efficiency: 94.7,  healthScore: 89, status: 'online',      riskLevel: 'LOW',      temperature: 37.6, vibration: 0.19, operatingHours: 13400, lastMaintenance: '2024-11-20', nextMaintenance: '2025-05-20', lastUpdated: new Date().toISOString() },
  { assetId: 'HY-02', name: 'Banaskantha Hybrid Park',     type: 'hybrid', region: 'Banaskantha', capacityMW: 50,   currentOutputMW: 38.9,  expectedOutputMW: 46.5,  efficiency: 83.7,  healthScore: 74, status: 'warning',     riskLevel: 'MEDIUM',   temperature: 44.3, vibration: 0.31, operatingHours: 20100, lastMaintenance: '2024-09-28', nextMaintenance: '2025-01-28', lastUpdated: new Date().toISOString() },
  { assetId: 'HY-03', name: 'Bhuj Hybrid Storage Complex', type: 'hybrid', region: 'Kutch',       capacityMW: 60,   currentOutputMW: 24.1,  expectedOutputMW: 56.4,  efficiency: 42.7,  healthScore: 53, status: 'warning',     riskLevel: 'HIGH',     temperature: 58.3, vibration: 0.44, operatingHours: 19800, lastMaintenance: '2024-07-15', nextMaintenance: '2024-12-20', lastUpdated: new Date().toISOString() },
];

function seedWeather(): LiveWeather {
  return {
    timestamp: new Date().toISOString(),
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
}

function seedGrid(): LiveGrid {
  return {
    timestamp: new Date().toISOString(),
    generationMW: 571.2,
    demandMW: 341.8,
    exportMW: 38.4,
    storageMW: 24.6,
    curtailmentMW: 0,
    gridFrequency: 49.97,
  };
}

// ─── Mutable singleton state ──────────────────────────────────────────────────
export const liveState: LiveState = {
  assets: seedAssets.map(a => ({ ...a })),
  weather: seedWeather(),
  grid: seedGrid(),
  tickCount: 0,
  dataSource: 'simulator',
  lastTick: new Date().toISOString(),
};
