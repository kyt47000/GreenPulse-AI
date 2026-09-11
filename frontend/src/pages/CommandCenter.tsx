import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, PieChart, Pie, Cell,
} from 'recharts';
import { generateHistoricalGeneration, generateGridData } from '../data/demoData';
import { useLiveStream } from '../hooks/useLiveStream';
import { format } from 'date-fns';

function KPICard({ label, value, sub, color, trend }: {
  label: string; value: React.ReactNode; sub?: string;
  color?: string; trend?: number;
}) {
  return (
    <div className="kpi-card">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color: color || 'var(--text)' }}>{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {trend !== undefined && (
        <div className={`kpi-trend ${trend >= 0 ? 'up' : 'down'}`}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend)}% vs yesterday
        </div>
      )}
    </div>
  );
}

// ── Live indicator pill ────────────────────────────────────────────────────────
function LiveBadge({ connected, dataSource, tickCount }: {
  connected: boolean; dataSource: string; tickCount: number;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      fontSize: 11, padding: '2px 8px', borderRadius: 20,
      background: connected ? 'rgba(63,185,80,.12)' : 'rgba(200,200,200,.12)',
      color: connected ? 'var(--accent)' : 'var(--text-muted)',
      border: `1px solid ${connected ? 'rgba(63,185,80,.3)' : 'var(--border)'}`,
      fontWeight: 600, userSelect: 'none',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: '50%',
        background: connected ? 'var(--accent)' : 'var(--text-muted)',
        boxShadow: connected ? '0 0 4px var(--accent)' : 'none',
      }} />
      {connected
        ? `${dataSource === 'ibm-live' ? '☁️ IBM LIVE' : 'SIMULATOR'} · tick ${tickCount}`
        : 'Connecting…'}
    </span>
  );
}

export default function CommandCenter() {
  const nav = useNavigate();
  const { assets, alerts, connected, dataSource, tickCount } = useLiveStream();

  const [genData, setGenData] = useState<any[]>([]);
  const [gridData, setGridData] = useState<any[]>([]);

  // Historical charts are static (generated once from demoData — replaced by
  // IBM Cloud Databases query when DATA_SOURCE=ibm-live)
  useEffect(() => {
    const hist = generateHistoricalGeneration(2);
    const hourly = hist.slice(-24).map(d => ({
      time: format(new Date(d.timestamp), 'HH:mm'),
      Solar: parseFloat(d.solarMW.toFixed(0)),
      Wind:  parseFloat(d.windMW.toFixed(0)),
    }));
    setGenData(hourly);

    const grid = generateGridData(1).slice(-12).map(d => ({
      time:       format(new Date(d.timestamp), 'HH:mm'),
      Generation: parseFloat(d.generationMW.toFixed(0)),
      Demand:     parseFloat(d.demandMW.toFixed(0)),
    }));
    setGridData(grid);
  }, []);

  // ── KPIs derived from live asset state ────────────────────────────────────
  const online       = assets.filter(a => a.status === 'online').length;
  const totalCap     = assets.reduce((s, a) => s + a.capacityMW, 0);
  const currentGen   = assets.reduce((s, a) => s + a.currentOutputMW, 0);
  const solarCurrent = assets.filter(a => a.type === 'solar').reduce((s, a) => s + a.currentOutputMW, 0);
  const windCurrent  = assets.filter(a => a.type === 'wind').reduce((s, a) => s + a.currentOutputMW, 0);
  const hybridCurrent= assets.filter(a => a.type === 'hybrid').reduce((s, a) => s + a.currentOutputMW, 0);
  const solarCap     = assets.filter(a => a.type === 'solar').reduce((s, a) => s + a.capacityMW, 0);
  const windCap      = assets.filter(a => a.type === 'wind').reduce((s, a) => s + a.capacityMW, 0);
  const hybridCap    = assets.filter(a => a.type === 'hybrid').reduce((s, a) => s + a.capacityMW, 0);
  const expectedSum  = assets.reduce((s, a) => s + a.expectedOutputMW, 0);
  const perfScore    = expectedSum > 0 ? (currentGen / expectedSum) * 100 : 0;
  const critAlerts   = alerts.filter(a => !a.resolved && (a.severity === 'critical' || a.severity === 'high')).length;

  const riskDist = [
    { name: 'Low',      value: assets.filter(a => a.riskLevel === 'LOW').length,      color: '#3fb950' },
    { name: 'Medium',   value: assets.filter(a => a.riskLevel === 'MEDIUM').length,   color: '#e3b341' },
    { name: 'High',     value: assets.filter(a => a.riskLevel === 'HIGH').length,     color: '#ff7b72' },
    { name: 'Critical', value: assets.filter(a => a.riskLevel === 'CRITICAL').length, color: '#f85149' },
  ];

  return (
    <div>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <h1>⚡ Command Center</h1>
        <div className="page-subtitle" style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span>Live overview — {assets.length} assets · Kutch &amp; Banaskantha, Gujarat</span>
          <LiveBadge connected={connected} dataSource={dataSource} tickCount={tickCount} />
        </div>
      </div>

      {/* ─── Top KPIs ────────────────────────────────────────────────────── */}
      <div className="kpi-grid">
        <KPICard label="Total Capacity"      value={`${totalCap.toFixed(0)} MW`}       sub="All assets" />
        <KPICard label="Current Generation"  value={`${currentGen.toFixed(1)} MW`}     sub="Live output"  color="var(--accent)"      trend={2.1} />
        <KPICard label="Today's Generation"  value={`${(currentGen * 8.4 / 1000).toFixed(2)} GWh`} sub="Estimated" />
        <KPICard
          label="Performance Score"
          value={`${perfScore.toFixed(1)}%`}
          sub="Actual / Expected"
          color={perfScore > 90 ? 'var(--accent)' : perfScore > 80 ? 'var(--medium)' : 'var(--critical)'}
        />
        <KPICard
          label="Assets Online"
          value={`${online} / ${assets.length}`}
          sub={`${assets.filter(a => a.status === 'warning').length} warning, ${assets.filter(a => a.status === 'maintenance').length} offline`}
          color="var(--accent-blue)"
        />
        <KPICard
          label="Critical Alerts"
          value={critAlerts}
          sub="Unresolved HIGH+"
          color={critAlerts > 0 ? 'var(--critical)' : 'var(--accent)'}
        />
      </div>

      {/* ─── Solar / Wind / Hybrid KPIs ──────────────────────────────────── */}
      <div className="grid-3 mb-16">
        {([
          { label: '☀️ SOLAR',  cur: solarCurrent,  cap: solarCap,  color: 'var(--solar)',  cssVar: 'rgba(245,158,11,0.3)' },
          { label: '🌬️ WIND',   cur: windCurrent,   cap: windCap,   color: 'var(--wind)',   cssVar: 'rgba(56,189,248,0.3)' },
          { label: '⚡ HYBRID', cur: hybridCurrent, cap: hybridCap, color: 'var(--hybrid)', cssVar: 'rgba(139,92,246,0.3)' },
        ] as const).map(({ label, cur, cap, color }) => (
          <div key={label} className="card card-sm" style={{ borderTop: `2px solid ${color}` }}>
            <div style={{ fontSize: 11, color, fontWeight: 600, marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 22, fontWeight: 700 }}>{cur.toFixed(1)} MW</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Capacity: {cap.toFixed(0)} MW</div>
            <div className="progress-bar mt-8">
              <div
                className="progress-fill"
                style={{ width: `${cap > 0 ? (cur / cap) * 100 : 0}%`, background: color }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ─── Charts ──────────────────────────────────────────────────────── */}
      <div className="grid-2 mb-16">
        <div className="card">
          <div className="card-header">
            <h3>Generation — Last 24 Hours</h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>MW</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={genData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="Solar" stackId="1" stroke="var(--solar)" fill="rgba(245,158,11,0.3)" />
              <Area type="monotone" dataKey="Wind"  stackId="1" stroke="var(--wind)"  fill="rgba(56,189,248,0.3)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Grid Balance — Last 12 Hours</h3>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>MW</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gridData} margin={{ top: 0, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={2} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Generation" fill="rgba(63,185,80,0.7)" />
              <Bar dataKey="Demand"     fill="rgba(88,166,255,0.7)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Asset Health Distribution + Active Alerts ───────────────────── */}
      <div className="grid-2 mb-16">
        <div className="card">
          <h3 className="mb-12">Asset Health Distribution</h3>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <ResponsiveContainer width={120} height={120}>
              <PieChart>
                <Pie data={riskDist} cx="50%" cy="50%" innerRadius={35} outerRadius={55} dataKey="value" paddingAngle={2}>
                  {riskDist.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {riskDist.map(item => (
                <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, flex: 1 }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Active Alerts</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/alerts')}>View All</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {alerts.filter(a => !a.resolved).slice(0, 4).map(alert => (
              <div
                key={alert.id}
                style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '8px 10px', background: 'var(--surface2)', borderRadius: 6,
                  borderLeft: `3px solid var(--${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : 'medium'})`,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{alert.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{alert.assetName || alert.category}</div>
                </div>
                <span className={`badge badge-${alert.severity}`}>{alert.severity.toUpperCase()}</span>
              </div>
            ))}
            {alerts.filter(a => !a.resolved).length === 0 && (
              <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '16px 0' }}>
                ✅ No active alerts
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Asset Status Table ───────────────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <h3>Asset Status Overview</h3>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/assets')}>Full Monitoring →</button>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Region</th>
                <th>Output</th>
                <th>Expected</th>
                <th>Efficiency</th>
                <th>Health</th>
                <th>Status</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {assets.slice(0, 8).map(asset => (
                <tr key={asset.assetId} className="clickable" onClick={() => nav(`/assets/${asset.assetId}`)}>
                  <td className="font-mono">{asset.assetId}</td>
                  <td style={{ fontWeight: 500 }}>{asset.name}</td>
                  <td><span className={`badge badge-${asset.type}`}>{asset.type}</span></td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.region}</td>
                  <td style={{ fontWeight: 600 }}>{asset.currentOutputMW.toFixed(1)} MW</td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.expectedOutputMW.toFixed(1)} MW</td>
                  <td>
                    <span style={{ color: asset.efficiency >= 95 ? 'var(--accent)' : asset.efficiency >= 85 ? 'var(--medium)' : 'var(--critical)' }}>
                      {asset.efficiency.toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar" style={{ width: 50 }}>
                        <div
                          className="progress-fill"
                          style={{
                            width: `${asset.healthScore}%`,
                            background: asset.healthScore >= 80 ? 'var(--accent)' : asset.healthScore >= 60 ? 'var(--medium)' : 'var(--critical)',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: 11 }}>{asset.healthScore}%</span>
                    </div>
                  </td>
                  <td><span className={`badge badge-${asset.status}`}>{asset.status}</span></td>
                  <td><span className={`badge badge-${asset.riskLevel.toLowerCase()}`}>{asset.riskLevel}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
