import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { maintenanceRecords } from '../data/demoData';

const riskColors: Record<string, string> = {
  CRITICAL: 'var(--critical)',
  HIGH: 'var(--high)',
  MEDIUM: 'var(--medium)',
  LOW: 'var(--low)',
};

export default function PredictiveMaintenance() {
  const nav = useNavigate();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? maintenanceRecords : maintenanceRecords.filter(m => m.riskLevel === filter);

  const scatterData = maintenanceRecords.map(m => ({
    x: m.healthScore,
    y: m.failureRisk,
    name: m.assetId,
    risk: m.riskLevel,
  }));

  const priorityGroups = {
    CRITICAL: maintenanceRecords.filter(m => m.riskLevel === 'CRITICAL'),
    HIGH: maintenanceRecords.filter(m => m.riskLevel === 'HIGH'),
    MEDIUM: maintenanceRecords.filter(m => m.riskLevel === 'MEDIUM'),
    LOW: maintenanceRecords.filter(m => m.riskLevel === 'LOW'),
  };

  return (
    <div>
      <div className="page-header">
        <h1>🔧 Predictive Maintenance</h1>
        <div className="page-subtitle">
          AI-powered failure prediction · {maintenanceRecords.filter(m => m.riskLevel === 'CRITICAL').length} critical · {maintenanceRecords.filter(m => m.riskLevel === 'HIGH').length} high · {maintenanceRecords.filter(m => m.riskLevel === 'MEDIUM').length} medium
          &nbsp;·&nbsp;<span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype demo data — simulated sensor signals</span>
        </div>
      </div>

      {/* ─── Priority Queue ─────────────────────────────────── */}
      <div className="grid-4 mb-16">
        {Object.entries(priorityGroups).map(([level, items]) => (
          <div key={level} className="card card-sm" style={{ borderTop: `2px solid ${riskColors[level]}` }}>
            <div style={{ fontSize: 11, color: riskColors[level], fontWeight: 600, marginBottom: 6 }}>{level}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: riskColors[level] }}>{items.length}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>assets</div>
            {items.length > 0 && <div style={{ fontSize: 11, marginTop: 6 }}>{items[0]?.assetId}</div>}
          </div>
        ))}
      </div>

      {/* ─── Risk Matrix ─────────────────────────────────────── */}
      <div className="grid-2 mb-16">
        <div className="card">
          <h3 className="mb-12">Risk Matrix — Health Score vs Failure Risk</h3>
          <ResponsiveContainer width="100%" height={220}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="x" name="Health Score" unit="%" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Health Score %', position: 'insideBottom', offset: -10, style: { fill: 'var(--text-muted)', fontSize: 11 } }} />
              <YAxis dataKey="y" name="Failure Risk" unit="%" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} label={{ value: 'Failure Risk %', angle: -90, position: 'insideLeft', style: { fill: 'var(--text-muted)', fontSize: 11 } }} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
                    <div style={{ fontWeight: 600 }}>{d.name}</div>
                    <div>Health: {d.x}%</div>
                    <div>Failure Risk: {d.y}%</div>
                    <span className={`badge badge-${d.risk.toLowerCase()}`}>{d.risk}</span>
                  </div>
                );
              }} />
              <Scatter data={scatterData} r={6}>
                {scatterData.map((entry, i) => (
                  <Cell key={i} fill={riskColors[entry.risk]} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {Object.entries(riskColors).map(([level, color]) => (
              <div key={level} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                {level}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="mb-12">Maintenance Priority Queue</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {maintenanceRecords.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 12px', background: 'var(--surface2)', borderRadius: 6, borderLeft: `3px solid ${riskColors[m.riskLevel]}`, cursor: 'pointer' }} onClick={() => nav(`/assets/${m.assetId}`)}>
                <div style={{ fontSize: 13, fontWeight: 700, color: riskColors[m.riskLevel], minWidth: 16 }}>{i + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{m.assetId} — {m.assetName}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{m.estimatedWindow}</div>
                </div>
                <span className={`badge badge-${m.riskLevel.toLowerCase()}`}>{m.riskLevel}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Maintenance Table ───────────────────────────────── */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-header">
          <h3>Maintenance Risk Assessment</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>{f === 'all' ? 'All' : f}</button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset</th>
                <th>Type</th>
                <th>Health Score</th>
                <th>Failure Risk</th>
                <th>Risk Level</th>
                <th>Component</th>
                <th>Maintenance Window</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="clickable" onClick={() => nav(`/assets/${m.assetId}`)}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{m.assetId}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{m.assetName}</div>
                  </td>
                  <td><span className={`badge badge-${m.assetType}`}>{m.assetType}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{ width: `${m.healthScore}%`, background: m.healthScore >= 80 ? 'var(--accent)' : m.healthScore >= 60 ? 'var(--medium)' : 'var(--critical)' }} />
                      </div>
                      <span style={{ fontSize: 11 }}>{m.healthScore}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: riskColors[m.riskLevel] }}>{m.failureRisk}%</span>
                  </td>
                  <td><span className={`badge badge-${m.riskLevel.toLowerCase()}`}>{m.riskLevel}</span></td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{m.component}</td>
                  <td style={{ fontSize: 12, fontWeight: 500 }}>{m.estimatedWindow}</td>
                  <td style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 220 }}>{m.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── AI Explanation Card for WT-07 ──────────────────── */}
      <div className="ai-card">
        <div className="ai-card-title">🤖 AI HIGHLIGHT — WT-07 PREDICTIVE MAINTENANCE · IBM Granite</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="ai-field">
              <div className="ai-field-label">WHAT</div>
              <div className="ai-field-value">WT-07 output is 18% below expected. Vibration is 37% above threshold.</div>
            </div>
            <div className="ai-field">
              <div className="ai-field-label">WHY</div>
              <div className="ai-field-value">Gearbox vibration has trended from 0.32 → 0.89 over 7 days. RPM dropped 10.4 vs rated 14.2. Temperature: 42.8°C (elevated). Operating hours: 27,800h — past lubrication interval.</div>
            </div>
          </div>
          <div>
            <div className="ai-field">
              <div className="ai-field-label">ACTION</div>
              <div className="ai-field-value" style={{ color: 'var(--accent)' }}>Schedule gearbox inspection within 2–4 days. Check oil levels, bearing wear, and gear mesh alignment. Reduce turbine load to 70% capacity until inspection.</div>
            </div>
            <div className="ai-field">
              <div className="ai-field-label">CONFIDENCE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="progress-bar" style={{ width: 100 }}>
                  <div className="progress-fill progress-blue" style={{ width: '87%' }} />
                </div>
                <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>87%</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 12 }}>Prototype estimate — simulated sensor data · Not actual field measurements</div>
      </div>
    </div>
  );
}
