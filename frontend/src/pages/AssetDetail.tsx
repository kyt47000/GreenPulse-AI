import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { assets, generateHistoricalGeneration, maintenanceRecords } from '../data/demoData';
import { format, subHours } from 'date-fns';

function buildTrend(asset: any, hours: number) {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const ts = subHours(now, hours - 1 - i);
    const hour = ts.getHours();
    const isDaytime = hour >= 6 && hour <= 18;
    const base = asset.type === 'wind'
      ? asset.expectedOutputMW * (0.85 + Math.sin(i * 0.4) * 0.12) + (Math.random() - 0.5) * 0.15
      : isDaytime ? asset.expectedOutputMW * (0.7 + Math.sin((hour - 6) * Math.PI / 12) * 0.3) : 0;
    // WT-07: add degradation trend
    const degradation = asset.assetId === 'WT-07' ? Math.max(0, 1 - (hours - i) * 0.003) : 1;
    return {
      time: format(ts, 'HH:mm'),
      Actual: parseFloat((base * degradation + (Math.random() - 0.5) * 0.05).toFixed(2)),
      Expected: parseFloat(asset.expectedOutputMW.toFixed(2)),
    };
  });
}

export default function AssetDetail() {
  const { assetId } = useParams<{ assetId: string }>();
  const nav = useNavigate();
  const [timeRange, setTimeRange] = useState<24 | 168 | 720>(24);
  const asset = assets.find(a => a.assetId === assetId);
  const maintenance = maintenanceRecords.find(m => m.assetId === assetId);

  if (!asset) return (
    <div className="empty-state">
      <div style={{ fontSize: 32 }}>❓</div>
      <div>Asset not found: {assetId}</div>
      <button className="btn btn-secondary mt-16" onClick={() => nav('/assets')}>← Back to Assets</button>
    </div>
  );

  const trendData = buildTrend(asset, timeRange === 24 ? 24 : timeRange === 168 ? 48 : 72);
  const deviation = ((asset.currentOutputMW - asset.expectedOutputMW) / asset.expectedOutputMW * 100);

  // AI diagnosis based on asset state
  const aiDiagnosis = asset.assetId === 'WT-07' ? {
    what: 'WT-07 output is 18% below expected under current wind conditions.',
    why: 'Vibration sensor reads 0.89 (threshold: 0.65) — 37% above safe range. RPM: 10.4 vs rated 14.2. Gearbox oil temperature elevated at 42.8°C. Health score fell from 81% to 61% over 7 days.',
    action: 'Schedule gearbox inspection within 2–4 days. Check oil viscosity and bearing wear. Consider reducing load to 70% until inspection.',
    confidence: 87,
  } : asset.assetId === 'WT-08' ? {
    what: 'WT-08 has experienced a complete drivetrain failure and is offline.',
    why: 'Bearing temperature reached 94°C triggering emergency shutdown. Vibration exceeded safety threshold 3× in 4 hours. Failure probability reached 96%.',
    action: 'Emergency replacement of main bearing and gearbox. Dispatch maintenance crew immediately.',
    confidence: 96,
  } : asset.assetId === 'SF-04' ? {
    what: 'Deesa Solar Array efficiency is 89.8% vs design target of 96%.',
    why: 'Inverter INV-12 temperature has increased from 42°C to 51°C over 7 days. Efficiency dropped 9% in parallel. Thermal trend indicates cooling system failure.',
    action: 'Inspect inverter cooling system within 72 hours. Clean cooling fins and test thermal management fans.',
    confidence: 79,
  } : {
    what: `${asset.name} is operating ${Math.abs(deviation).toFixed(1)}% ${deviation >= 0 ? 'above' : 'below'} expected output.`,
    why: `Health score: ${asset.healthScore}%. Vibration: ${asset.vibration.toFixed(2)}. Temperature: ${asset.temperature.toFixed(1)}°C. Operating hours: ${asset.operatingHours.toLocaleString()}h.`,
    action: asset.riskLevel === 'LOW' ? 'No immediate action required. Continue monitoring.' : `Review asset at next scheduled maintenance window (${asset.nextMaintenance}).`,
    confidence: asset.healthScore,
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/assets')}>← Assets</button>
          <h1>{asset.assetId} — {asset.name}</h1>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
          <span className={`badge badge-${asset.type}`}>{asset.type}</span>
          <span className={`badge badge-${asset.status}`}>{asset.status}</span>
          <span className={`badge badge-${asset.riskLevel.toLowerCase()}`}>{asset.riskLevel} RISK</span>
          <span className="tag">{asset.region}</span>
          <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginLeft: 'auto' }}>Prototype demo data</span>
        </div>
      </div>

      {/* ─── Telemetry KPIs ─────────────────────────────────── */}
      <div className="kpi-grid mb-16">
        <div className="kpi-card">
          <div className="kpi-label">Current Output</div>
          <div className="kpi-value" style={{ color: deviation < -10 ? 'var(--critical)' : deviation < 0 ? 'var(--medium)' : 'var(--accent)' }}>{asset.currentOutputMW.toFixed(2)} MW</div>
          <div className="kpi-sub">Expected: {asset.expectedOutputMW.toFixed(2)} MW</div>
          <div className={`kpi-trend ${deviation >= 0 ? 'up' : 'down'}`}>{deviation >= 0 ? '▲' : '▼'} {Math.abs(deviation).toFixed(1)}% vs expected</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Efficiency</div>
          <div className="kpi-value" style={{ color: asset.efficiency >= 95 ? 'var(--accent)' : asset.efficiency >= 85 ? 'var(--medium)' : 'var(--critical)' }}>{asset.efficiency.toFixed(1)}%</div>
          <div className="kpi-sub">Design target: ~96%</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Health Score</div>
          <div className="kpi-value" style={{ color: asset.healthScore >= 80 ? 'var(--accent)' : asset.healthScore >= 60 ? 'var(--medium)' : 'var(--critical)' }}>{asset.healthScore}%</div>
          <div className="progress-bar mt-8"><div className="progress-fill" style={{ width: `${asset.healthScore}%`, background: asset.healthScore >= 80 ? 'var(--accent)' : asset.healthScore >= 60 ? 'var(--medium)' : 'var(--critical)' }} /></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Temperature</div>
          <div className="kpi-value" style={{ color: asset.temperature > 42 ? 'var(--medium)' : 'var(--text)' }}>{asset.temperature.toFixed(1)}°C</div>
          <div className="kpi-sub">{asset.temperature > 42 ? '⚠️ Above normal' : 'Normal range'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Vibration</div>
          <div className="kpi-value" style={{ color: asset.vibration > 0.65 ? 'var(--critical)' : asset.vibration > 0.4 ? 'var(--medium)' : 'var(--accent)' }}>{asset.vibration.toFixed(2)}</div>
          <div className="kpi-sub">Threshold: 0.65</div>
        </div>
        {asset.rpm !== undefined && (
          <div className="kpi-card">
            <div className="kpi-label">RPM</div>
            <div className="kpi-value">{asset.rpm?.toFixed(1)}</div>
            <div className="kpi-sub">Rated: ~14.5 RPM</div>
          </div>
        )}
        <div className="kpi-card">
          <div className="kpi-label">Capacity</div>
          <div className="kpi-value">{asset.capacityMW} MW</div>
          <div className="kpi-sub">Installed</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Operating Hours</div>
          <div className="kpi-value" style={{ fontSize: 18 }}>{asset.operatingHours.toLocaleString()}</div>
          <div className="kpi-sub">Lifetime</div>
        </div>
      </div>

      {/* ─── Output Trend Chart ──────────────────────────────── */}
      <div className="card mb-16">
        <div className="card-header">
          <h3>Output: Actual vs Expected</h3>
          <div style={{ display: 'flex', gap: 6 }}>
            {[24, 168, 720].map(r => (
              <button key={r} className={`btn btn-sm ${timeRange === r ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setTimeRange(r as any)}>
                {r === 24 ? '24h' : r === 168 ? '7d' : '30d'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={trendData} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={Math.floor(trendData.length / 8)} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Expected" stroke="var(--text-subtle)" fill="transparent" strokeDasharray="4 2" />
            <Area type="monotone" dataKey="Actual" stroke={asset.riskLevel === 'HIGH' || asset.riskLevel === 'CRITICAL' ? 'var(--critical)' : 'var(--accent)'} fill={asset.riskLevel === 'HIGH' ? 'rgba(248,81,73,0.15)' : 'rgba(63,185,80,0.15)'} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── AI Diagnosis ────────────────────────────────────── */}
      <div className="grid-2 mb-16">
        <div className="ai-card">
          <div className="ai-card-title">🤖 AI DIAGNOSIS — IBM Granite</div>
          <div className="ai-field">
            <div className="ai-field-label">WHAT</div>
            <div className="ai-field-value">{aiDiagnosis.what}</div>
          </div>
          <div className="ai-field">
            <div className="ai-field-label">WHY</div>
            <div className="ai-field-value">{aiDiagnosis.why}</div>
          </div>
          <div className="ai-field">
            <div className="ai-field-label">ACTION</div>
            <div className="ai-field-value" style={{ color: 'var(--accent)' }}>{aiDiagnosis.action}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 12 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI Confidence:</span>
            <div className="progress-bar" style={{ width: 80 }}>
              <div className="progress-fill progress-blue" style={{ width: `${aiDiagnosis.confidence}%` }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)' }}>{aiDiagnosis.confidence}%</span>
          </div>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 8 }}>Prototype estimate — simulated data</div>
        </div>

        <div className="card">
          <h3 className="mb-12">Maintenance Information</h3>
          {maintenance ? (
            <div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>ISSUE</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>{maintenance.issue}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>RECOMMENDATION</div>
                <div style={{ fontSize: 13, marginTop: 2, color: 'var(--accent)' }}>{maintenance.recommendation}</div>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>WINDOW</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{maintenance.estimatedWindow}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>FAILURE RISK</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: maintenance.riskLevel === 'CRITICAL' ? 'var(--critical)' : maintenance.riskLevel === 'HIGH' ? 'var(--high)' : 'var(--medium)' }}>{maintenance.failureRisk}%</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>COMPONENT</div>
                  <div style={{ fontSize: 13 }}>{maintenance.component}</div>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>LAST MAINTENANCE</div>
                <div style={{ fontSize: 13, marginTop: 2 }}>{asset.lastMaintenance}</div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>NEXT SCHEDULED</div>
                <div style={{ fontSize: 13, color: 'var(--accent)', marginTop: 2 }}>{asset.nextMaintenance}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>STATUS</div>
                <span className="badge badge-low" style={{ marginTop: 4 }}>No immediate maintenance required</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button className="btn btn-secondary" onClick={() => nav('/maintenance')}>View Full Maintenance Report →</button>
      </div>
    </div>
  );
}
