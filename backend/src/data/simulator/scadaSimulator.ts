// ─── SCADA Simulator ──────────────────────────────────────────────────────────
// Runs a background tick every TICK_MS milliseconds.
// Each tick applies realistic sensor drift using Math.random(), slowly escalates
// known degraded assets (WT-07, HY-03), and occasionally injects edge-case events.
// On every tick the updated LiveState is emitted so the SSE route can push it.

import { liveState, LiveAsset } from './liveAssetState';
import sseEmitter from './sseEmitter';

const TICK_MS = 3000; // 3-second heartbeat — matches real SCADA polling rates

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Clamp a value between min and max */
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Gaussian-like noise: sum of two uniform randoms centered at 0, scaled by σ */
const noise = (sigma: number) => (Math.random() - 0.5 + Math.random() - 0.5) * sigma;

/** Return true with the given probability (0–1) */
const chance = (p: number) => Math.random() < p;

/** Derive riskLevel from health score */
function riskFromHealth(h: number): LiveAsset['riskLevel'] {
  if (h <= 30) return 'CRITICAL';
  if (h <= 55) return 'HIGH';
  if (h <= 75) return 'MEDIUM';
  return 'LOW';
}

/** Derive status from health + output */
function statusFromHealth(asset: LiveAsset): LiveAsset['status'] {
  if (asset.status === 'maintenance') return 'maintenance'; // sticky until manually cleared
  if (asset.healthScore <= 20 || asset.currentOutputMW === 0 && asset.capacityMW > 5) return 'offline';
  if (asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL') return 'warning';
  return 'online';
}

// ─── Per-asset tick ───────────────────────────────────────────────────────────
function tickAsset(a: LiveAsset): void {
  const now = new Date().toISOString();
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;

  a.operatingHours += TICK_MS / 3_600_000; // accumulate real operating time
  a.lastUpdated = now;

  // ── Solar farms ────────────────────────────────────────────────────────────
  if (a.type === 'solar') {
    if (a.status === 'maintenance' || a.status === 'offline') return;

    // SF-06 dust storm — output locked low, recovering very slowly
    if (a.assetId === 'SF-06') {
      a.currentOutputMW = clamp(a.currentOutputMW + noise(0.8) + 0.02, 0, a.capacityMW * 0.25);
      a.temperature = clamp(a.temperature + noise(0.3), 44, 55);
      a.healthScore = clamp(a.healthScore + 0.005, 20, 50); // slow recovery
    } else {
      const solarFactor = isDaytime ? Math.sin(((hour - 6) / 12) * Math.PI) : 0;
      const targetOutput = a.capacityMW * solarFactor * (a.healthScore / 100) * 0.95;
      a.currentOutputMW = clamp(a.currentOutputMW + noise(2.5) * 0.4 + (targetOutput - a.currentOutputMW) * 0.05, 0, a.capacityMW);
      a.temperature = clamp(a.temperature + noise(0.4), 28, 52);
    }
    a.efficiency = a.expectedOutputMW > 0
      ? clamp((a.currentOutputMW / a.expectedOutputMW) * 100 + noise(0.5), 0, 115)
      : 0;
  }

  // ── Wind turbines ──────────────────────────────────────────────────────────
  if (a.type === 'wind') {
    if (a.assetId === 'WT-08') return; // locked offline — maintenance in progress

    // WT-10 comm loss — stays offline; small chance of reconnect
    if (a.assetId === 'WT-10') {
      if (chance(0.001)) { // 0.1% per tick (~5 min avg) to reconnect
        a.status = 'online';
        a.currentOutputMW = a.expectedOutputMW * (0.8 + Math.random() * 0.2);
        a.healthScore = clamp(a.healthScore + 5, 40, 60);
      }
      return;
    }

    // WT-07 progressive degradation — the key demo scenario
    if (a.assetId === 'WT-07') {
      a.vibration = clamp(a.vibration + 0.0003 + noise(0.002), 0.6, 1.3);    // slowly worsens
      a.healthScore = clamp(a.healthScore - 0.002, 15, 65);                   // steadily drops
      if (a.rpm !== undefined) a.rpm = clamp(a.rpm + noise(0.15) - 0.01, 8, 12); // RPM degrading
      a.temperature = clamp(a.temperature + noise(0.3) + 0.01, 38, 52);
      a.currentOutputMW = clamp(
        a.currentOutputMW + noise(0.08) - 0.002,
        1.2, 2.0,
      );
    } else {
      // Healthy wind turbines — natural wind variation
      const windFactor = 0.75 + noise(0.15);
      const targetOutput = a.capacityMW * clamp(windFactor, 0, 1.05);
      a.currentOutputMW = clamp(
        a.currentOutputMW + noise(0.12) + (targetOutput - a.currentOutputMW) * 0.1,
        0, a.capacityMW * 1.05,
      );
      a.vibration = clamp(a.vibration + noise(0.005), 0.1, 0.9);
      if (a.rpm !== undefined) a.rpm = clamp(a.rpm + noise(0.2), 10, 17);
      a.temperature = clamp(a.temperature + noise(0.3), 28, 46);

      // WT-05 slow vibration escalation
      if (a.assetId === 'WT-05') {
        a.vibration = clamp(a.vibration + 0.0001, 0.5, 1.0);
        a.healthScore = clamp(a.healthScore - 0.001, 40, 80);
      }
    }
    a.efficiency = a.expectedOutputMW > 0
      ? clamp((a.currentOutputMW / a.expectedOutputMW) * 100 + noise(0.8), 0, 115)
      : 0;
  }

  // ── Hybrid sites ───────────────────────────────────────────────────────────
  if (a.type === 'hybrid') {
    // HY-03 thermal runaway — temperature rising, output degrading
    if (a.assetId === 'HY-03') {
      a.temperature = clamp(a.temperature + noise(0.2) + 0.02, 50, 65);
      a.currentOutputMW = clamp(a.currentOutputMW + noise(1.2) - 0.05, 5, 35);
      a.healthScore = clamp(a.healthScore - 0.003, 20, 60);
      a.vibration = clamp(a.vibration + noise(0.01), 0.3, 0.8);
    } else {
      const factor = isDaytime ? 0.85 + noise(0.08) : 0.4 + noise(0.06);
      const targetOutput = a.capacityMW * clamp(factor, 0, 1);
      a.currentOutputMW = clamp(
        a.currentOutputMW + noise(1.5) + (targetOutput - a.currentOutputMW) * 0.08,
        0, a.capacityMW,
      );
      a.temperature = clamp(a.temperature + noise(0.4), 30, 50);
    }
    a.efficiency = a.expectedOutputMW > 0
      ? clamp((a.currentOutputMW / a.expectedOutputMW) * 100 + noise(0.6), 0, 115)
      : 0;
  }

  // Update derived fields
  a.healthScore = clamp(a.healthScore, 0, 100);
  a.riskLevel = riskFromHealth(a.healthScore);
  a.status = statusFromHealth(a);

  // ── Occasional random edge-case spikes (1% per tick per eligible asset) ────
  if (chance(0.01) && a.status === 'online') {
    // Random micro-spike: temperature surge or vibration burst
    if (chance(0.5)) a.temperature = clamp(a.temperature + 3 + Math.random() * 4, 0, 70);
    else             a.vibration   = clamp(a.vibration   + 0.05 + Math.random() * 0.1, 0, 1.5);
  }
}

// ─── Weather tick ─────────────────────────────────────────────────────────────
function tickWeather(): void {
  const w = liveState.weather;
  const hour = new Date().getHours();
  const isDaytime = hour >= 6 && hour <= 18;

  w.timestamp    = new Date().toISOString();
  w.temperature  = clamp(w.temperature  + noise(0.3), 22, 52);
  w.windSpeed    = clamp(w.windSpeed    + noise(0.4), 2, 28);
  w.solarIrradiance = isDaytime
    ? clamp(w.solarIrradiance + noise(15), 50, 1050)
    : 0;
  w.cloudCover   = clamp(w.cloudCover   + noise(2),   0, 100);
  w.humidity     = clamp(w.humidity     + noise(1),  20, 95);
  w.feelsLike    = clamp(w.temperature + 2 + noise(1), 20, 58);
  w.rainProbability = clamp(w.rainProbability + noise(1), 0, 100);

  // Occasionally rotate wind direction
  if (chance(0.02)) {
    w.windDirection = ['NW', 'NNW', 'N', 'NE', 'W', 'SW'][Math.floor(Math.random() * 6)];
  }
}

// ─── Grid tick ────────────────────────────────────────────────────────────────
function tickGrid(): void {
  const g = liveState.grid;
  const totalGen = liveState.assets.reduce((s, a) => s + a.currentOutputMW, 0);

  g.timestamp     = new Date().toISOString();
  g.generationMW  = parseFloat(totalGen.toFixed(1));
  g.demandMW      = clamp(g.demandMW + noise(4), 200, 450);
  const surplus   = Math.max(0, g.generationMW - g.demandMW);
  g.exportMW      = parseFloat(Math.min(surplus, 40).toFixed(1));
  g.storageMW     = parseFloat(Math.min(surplus - g.exportMW, 30).toFixed(1));
  g.curtailmentMW = parseFloat(Math.max(0, surplus - g.exportMW - g.storageMW).toFixed(1));
  g.gridFrequency = parseFloat(clamp(g.gridFrequency + noise(0.02), 49.5, 50.5).toFixed(3));
}

// ─── Main tick function ───────────────────────────────────────────────────────
function tick(): void {
  liveState.tickCount += 1;
  liveState.lastTick = new Date().toISOString();

  liveState.assets.forEach(tickAsset);
  tickWeather();
  tickGrid();

  // Emit to all SSE subscribers
  sseEmitter.emit('tick', liveState);
}

// ─── Start / Stop ─────────────────────────────────────────────────────────────
let intervalHandle: NodeJS.Timeout | null = null;

export function startSimulator(): void {
  if (intervalHandle) return; // already running
  console.log(`  🔄 SCADA Simulator started — tick every ${TICK_MS / 1000}s`);
  intervalHandle = setInterval(tick, TICK_MS);
}

export function stopSimulator(): void {
  if (intervalHandle) {
    clearInterval(intervalHandle);
    intervalHandle = null;
    console.log('  ⏹ SCADA Simulator stopped');
  }
}
