import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { generateGridData, assets } from '../data/demoData';
import { format } from 'date-fns';

const BEFORE = { export: 28, storage: 12, curtailment: 45, solarGen: 485, gridCap: 440 };
const AFTER = { export: 40, storage: 28, curtailment: 2, solarGen: 485, gridCap: 440 };

export default function GridOptimization() {
  const [gridHistory, setGridHistory] = useState<any[]>([]);
  const [scenario, setScenario] = useState(false);

  useEffect(() => {
    const data = generateGridData(12).map(d => ({
      time: format(new Date(d.timestamp), 'HH:mm'),
      Generation: parseFloat(d.generationMW.toFixed(0)),
      Demand: parseFloat(d.demandMW.toFixed(0)),
      Export: parseFloat(d.exportMW.toFixed(0)),
      Storage: parseFloat(d.storageMW.toFixed(0)),
      Curtailment: parseFloat(d.curtailmentMW.toFixed(1)),
    }));
    setGridHistory(data);
  }, []);

  const totalGen = assets.reduce((s, a) => s + a.currentOutputMW, 0);
  const solarGen = assets.filter(a => a.type === 'solar').reduce((s, a) => s + a.currentOutputMW, 0);
  const windGen = assets.filter(a => a.type === 'wind').reduce((s, a) => s + a.currentOutputMW, 0);

  const current = scenario ? AFTER : BEFORE;
  const efficiency = ((totalGen - current.curtailment) / totalGen * 100);

  return (
    <div>
      <div className="page-header">
        <h1>🔌 Grid Optimization</h1>
        <div className="page-subtitle">
          Renewable grid integration management · Export, storage &amp; curtailment optimization
          &nbsp;·&nbsp;<span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype demo data</span>
        </div>
      </div>

      {/* ─── Current Grid Status ─────────────────────────────── */}
      <div className="kpi-grid mb-16">
        <div className="kpi-card">
          <div className="kpi-label">Total Generation</div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>{totalGen.toFixed(1)} MW</div>
          <div className="kpi-sub">Solar + Wind + Hybrid</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Solar Generation</div>
          <div className="kpi-value" style={{ color: 'var(--solar)' }}>{solarGen.toFixed(1)} MW</div>
          <div className="kpi-sub">{(solarGen / totalGen * 100).toFixed(0)}% of total</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Wind Generation</div>
          <div className="kpi-value" style={{ color: 'var(--wind)' }}>{windGen.toFixed(1)} MW</div>
          <div className="kpi-sub">{(windGen / totalGen * 100).toFixed(0)}% of total</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Grid Export</div>
          <div className="kpi-value" style={{ color: 'var(--accent-blue)' }}>{current.export} MW</div>
          <div className="kpi-sub">Capacity: 440 MW</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Storage</div>
          <div className="kpi-value">{current.storage} MW</div>
          <div className="kpi-sub">Battery charging</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Curtailment</div>
          <div className="kpi-value" style={{ color: current.curtailment > 10 ? 'var(--critical)' : 'var(--accent)' }}>{current.curtailment} MW</div>
          <div className="kpi-sub">{current.curtailment > 10 ? '⚠️ Reduce action required' : '✅ Within limits'}</div>
        </div>
      </div>

      {/* ─── Energy Flow Diagram ─────────────────────────────── */}
      <div className="card mb-16">
        <div className="card-header">
          <h3>Energy Flow — {scenario ? 'After AI Recommendation' : 'Current State (Before AI Recommendation)'}</h3>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Scenario 2 Demo:</span>
            <button className={`btn btn-sm ${!scenario ? 'btn-secondary' : 'btn-primary'}`} onClick={() => setScenario(!scenario)}>
              {scenario ? '✅ After AI' : '▶ Apply AI Recommendation'}
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, alignItems: 'center', flexWrap: 'wrap', padding: '20px 0' }}>
          {/* Sources */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(245,158,11,.12)', border: '1px solid rgba(245,158,11,.3)', borderRadius: 8, padding: '12px 20px', textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>☀️</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--solar)' }}>Solar</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{solarGen.toFixed(0)} MW</div>
            </div>
            <div style={{ background: 'rgba(56,189,248,.12)', border: '1px solid rgba(56,189,248,.3)', borderRadius: 8, padding: '12px 20px', textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 18, marginBottom: 4 }}>🌬️</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--wind)' }}>Wind</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{windGen.toFixed(0)} MW</div>
            </div>
          </div>

          <div style={{ color: 'var(--accent)', fontSize: 24, padding: '0 16px' }}>→</div>

          {/* Total Gen */}
          <div style={{ background: 'rgba(63,185,80,.1)', border: '2px solid rgba(63,185,80,.3)', borderRadius: 8, padding: '16px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, marginBottom: 4 }}>⚡</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)' }}>Renewable Gen.</div>
            <div style={{ fontSize: 20, fontWeight: 800 }}>{totalGen.toFixed(0)} MW</div>
          </div>

          <div style={{ color: 'var(--text-muted)', fontSize: 24, padding: '0 16px' }}>→</div>

          {/* Outputs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ background: 'rgba(88,166,255,.12)', border: `1px solid ${scenario ? 'rgba(63,185,80,.4)' : 'rgba(88,166,255,.3)'}`, borderRadius: 8, padding: '10px 20px', textAlign: 'center', minWidth: 130, transition: 'border-color 0.3s' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-blue)' }}>🔌 Grid Export</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: scenario ? 'var(--accent)' : 'var(--text)' }}>{current.export} MW</div>
            </div>
            <div style={{ background: 'rgba(188,140,255,.12)', border: `1px solid ${scenario ? 'rgba(63,185,80,.4)' : 'rgba(188,140,255,.3)'}`, borderRadius: 8, padding: '10px 20px', textAlign: 'center', minWidth: 130, transition: 'border-color 0.3s' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-purple)' }}>🔋 Storage</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: scenario ? 'var(--accent)' : 'var(--text)' }}>{current.storage} MW</div>
            </div>
            <div style={{ background: `rgba(${current.curtailment > 10 ? '248,81,73' : '63,185,80'},.1)`, border: `1px solid rgba(${current.curtailment > 10 ? '248,81,73' : '63,185,80'},.3)`, borderRadius: 8, padding: '10px 20px', textAlign: 'center', minWidth: 130, transition: 'all 0.3s' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: current.curtailment > 10 ? 'var(--critical)' : 'var(--accent)' }}>⚡ Curtailment</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: current.curtailment > 10 ? 'var(--critical)' : 'var(--accent)' }}>{current.curtailment} MW</div>
            </div>
          </div>
        </div>

        {scenario && (
          <div style={{ background: 'rgba(63,185,80,.08)', border: '1px solid rgba(63,185,80,.2)', borderRadius: 6, padding: '10px 14px', marginTop: 8, fontSize: 12, color: 'var(--accent)' }}>
            ✅ AI recommendation applied — curtailment reduced from 45 MW → 2 MW (-96%). Export maximized. Storage pre-charged.
          </div>
        )}
      </div>

      {/* ─── Grid History Chart ─────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-12">Grid Balance — Last 12 Hours</h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={gridHistory} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={2} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Generation" stroke="var(--accent)" fill="rgba(63,185,80,0.15)" />
            <Area type="monotone" dataKey="Demand" stroke="var(--accent-blue)" fill="rgba(88,166,255,0.1)" />
            <Area type="monotone" dataKey="Export" stroke="var(--accent-purple)" fill="transparent" strokeDasharray="4 2" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── AI Grid Recommendation ─────────────────────────── */}
      <div className="ai-card">
        <div className="ai-card-title">🔌 GRID AI RECOMMENDATION — IBM Granite · SCENARIO 2</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>ACTION</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--accent)' }}>Increase Grid Export + Pre-Charge Storage</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>REASON</div>
              <div style={{ fontSize: 13, lineHeight: 1.6 }}>High solar generation forecast (485 MW peak) will exceed grid export capacity (440 MW) between 11:30–14:30, creating 45 MW curtailment risk. Pre-charging battery storage by 11:00 eliminates most curtailment.</div>
            </div>
          </div>
          <div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>CONFIDENCE</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress-fill progress-blue" style={{ width: '89%' }} />
                </div>
                <span style={{ fontWeight: 700, color: 'var(--accent-blue)' }}>89%</span>
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>EXPECTED BENEFIT</div>
              <div style={{ fontSize: 13, color: 'var(--accent)' }}>Reduce curtailment by ~43 MW (8% of peak generation). Estimated revenue recovery: ~₹12,400.</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>PRIORITY</div>
              <span className="badge badge-high">HIGH — Act before 11:00</span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, display: 'flex', gap: 10 }}>
          <button className="btn btn-primary btn-sm" onClick={() => setScenario(true)}>✅ Apply Recommendation</button>
          <button className="btn btn-secondary btn-sm">📋 View Full Report</button>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 10 }}>Prototype estimate — simulated data · Revenue figures are illustrative only</div>
      </div>
    </div>
  );
}
