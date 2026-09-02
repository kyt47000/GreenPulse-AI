// ─── Asset Types ─────────────────────────────────────────────────────────────
export type AssetType = 'solar' | 'wind' | 'hybrid';
export type AssetStatus = 'online' | 'offline' | 'maintenance' | 'warning';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AlertSeverity = 'info' | 'warning' | 'high' | 'critical';
export type AlertCategory = 'performance' | 'maintenance' | 'weather' | 'grid' | 'forecast';

export interface Asset {
  assetId: string;
  name: string;
  type: AssetType;
  region: string;
  location: { lat: number; lng: number };
  capacityMW: number;
  currentOutputMW: number;
  expectedOutputMW: number;
  efficiency: number;
  healthScore: number;
  status: AssetStatus;
  riskLevel: RiskLevel;
  temperature: number;
  vibration: number;
  rpm?: number;
  lastMaintenance: string;
  nextMaintenance: string;
  operatingHours: number;
  description: string;
}

// ─── Weather Types ────────────────────────────────────────────────────────────
export interface WeatherData {
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

// ─── Generation Types ─────────────────────────────────────────────────────────
export interface GenerationRecord {
  timestamp: string;
  solarMW: number;
  windMW: number;
  totalMW: number;
  expectedMW: number;
}

export interface GenerationForecast {
  timestamp: string;
  solarMW: number;
  windMW: number;
  totalMW: number;
  confidenceLow: number;
  confidenceHigh: number;
  weatherImpact: string;
}

// ─── Maintenance Types ────────────────────────────────────────────────────────
export interface MaintenanceRecord {
  id: string;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  healthScore: number;
  failureRisk: number;
  riskLevel: RiskLevel;
  issue: string;
  recommendation: string;
  estimatedWindow: string;
  component: string;
  lastInspection: string;
}

// ─── Grid Types ───────────────────────────────────────────────────────────────
export interface GridRecord {
  timestamp: string;
  generationMW: number;
  demandMW: number;
  exportMW: number;
  storageMW: number;
  curtailmentMW: number;
  gridFrequency: number;
}

// ─── Alert Types ──────────────────────────────────────────────────────────────
export interface Alert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  assetId?: string;
  assetName?: string;
  timestamp: string;
  title: string;
  problem: string;
  aiExplanation: string;
  recommendedAction: string;
  acknowledged: boolean;
  resolved: boolean;
}

// ─── Agent Types ──────────────────────────────────────────────────────────────
export type AgentStatus = 'idle' | 'analyzing' | 'completed' | 'warning';

export interface Agent {
  id: string;
  name: string;
  description: string;
  status: AgentStatus;
  lastRun: string;
  analysisCount: number;
  alertsGenerated: number;
}

export interface AgentEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  action: string;
  input: string;
  result: string;
  nextAgent?: string;
  severity?: 'info' | 'warning' | 'critical';
}

// ─── AI Types ─────────────────────────────────────────────────────────────────
export interface AIRecommendation {
  what: string;
  why: string;
  action: string;
  confidence: number;
  agentSource: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  agentSource?: string;
  recommendations?: AIRecommendation[];
}

// ─── Grid Recommendation ──────────────────────────────────────────────────────
export interface GridRecommendation {
  action: string;
  reason: string;
  confidence: number;
  expectedBenefit: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

// ─── Dashboard KPI ─────────────────────────────────────────────────────────────
export interface DashboardKPI {
  totalCapacityMW: number;
  currentGenerationMW: number;
  todayGenerationMWh: number;
  performanceScore: number;
  assetsOnline: number;
  totalAssets: number;
  criticalAlerts: number;
  solarCapacityMW: number;
  windCapacityMW: number;
  solarCurrentMW: number;
  windCurrentMW: number;
}
