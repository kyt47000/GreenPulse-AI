import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { edgeCaseScenarios, assets, alerts } from '../data/demoData';

const agentList = [
  { icon: '📡', name: 'Asset Performance', desc: 'Monitors 19 renewable assets — detects anomalies, dust impact, comm loss, thermal derating' },
  { icon: '🔧', name: 'Predictive Maintenance', desc: 'Analyzes vibration, temperature, RPM, HVAC data to predict failures across all failure modes' },
  { icon: '📈', name: 'Generation Forecast', desc: 'Predicts solar and wind output with edge-case models: dust storms, monsoon, high-wind cut-out' },
  { icon: '🌤', name: 'Weather Intelligence', desc: 'Interprets regional weather — irradiance, wind, dust index, extreme event detection' },
  { icon: '🔌', name: 'Grid Optimization', desc: 'Manages export, storage, curtailment — including emergency blackout and frequency deviation response' },
];

const impacts = [
  { metric: '~3.5×', label: 'Faster Anomaly Detection', sub: 'vs manual inspection cycles' },
  { metric: '72%', label: 'Failure Risk Identified Early', sub: 'WT-07 gearbox scenario' },
  { metric: '~8%', label: 'Curtailment Reduction', sub: 'grid optimization scenario' },
  { metric: '4,280 MWh', label: 'Daily Generation Forecast', sub: 'AI-predicted — demo data' },
  { metric: '19', label: 'Assets Monitored', sub: 'Solar, Wind, Hybrid + edge cases' },
  { metric: '6', label: 'Edge-Case Scenarios', sub: 'Real-world failure modes covered' },
];

function severityColor(s: string) {
  if (s === 'CRITICAL') return 'var(--critical)';
  if (s === 'HIGH') return 'var(--high)';
  return 'var(--medium)';
}

function severityBg(s: string) {
  if (s === 'CRITICAL') return 'rgba(218,30,40,.12)';
  if (s === 'HIGH') return 'rgba(255,131,43,.1)';
  return 'rgba(241,194,27,.1)';
}

export default function Home() {
  const nav = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [expandedScenario, setExpandedScenario] = useState<string | null>(null);

  // Live stats from demo data
  const onlineCount = assets.filter(a => a.status === 'online').length;
  const criticalCount = assets.filter(a => a.riskLevel === 'CRITICAL').length;
  const offlineCount = assets.filter(a => a.status === 'offline' || a.status === 'maintenance').length;
  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const totalCapacity = assets.reduce((s, a) => s + a.capacityMW, 0);
  const currentOutput = assets.reduce((s, a) => s + a.currentOutputMW, 0);
  const fleetEfficiency = ((currentOutput / totalCapacity) * 100).toFixed(1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>

      {/* ─── Top Nav Bar ──────────────────────────────────────────── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '10px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        backdropFilter: 'blur(8px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>🌿</span>
          <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--accent)', letterSpacing: '-0.2px' }}>GreenPulse AI</span>
          <span style={{ fontSize: 11, color: 'var(--text-subtle)', marginLeft: 4 }}>· Renewable Energy Intelligence</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/command-center')}>⚡ Dashboard</button>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/copilot')}>🤖 AI Copilot</button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {/* ─── Hero ─────────────────────────────────────────────────── */}
      <section style={{
        background: theme === 'dark'
          ? 'linear-gradient(180deg, #0a0f14 0%, #0d1117 60%, var(--bg) 100%)'
          : 'linear-gradient(180deg, #edf5ff 0%, #f4f4f4 100%)',
        borderBottom: '1px solid var(--border)',
        padding: '72px 40px 56px',
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(63,185,80,.1)', border: '1px solid rgba(63,185,80,.25)',
            borderRadius: 20, padding: '5px 14px', marginBottom: 24, fontSize: 12, color: 'var(--accent)',
            fontWeight: 500,
          }}>
            <span>🌿</span> Agentic AI · IBM Granite LLM · 6 Edge-Case Scenarios
          </div>

          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-1.5px', lineHeight: 1.05, marginBottom: 18 }}>
            <span style={{ color: 'var(--accent)' }}>GreenPulse</span>{' '}
            <span style={{ color: 'var(--text)' }}>AI</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.75, maxWidth: 600, margin: '0 auto 8px' }}>
            Monitor renewable assets. Predict failures. Forecast generation. Optimize grid integration.
            Handle real-world edge cases autonomously.
          </p>
          <p style={{ fontSize: 12, color: 'var(--text-subtle)', marginBottom: 36, marginTop: 8 }}>
            Kutch &amp; Banaskantha, Gujarat, India · IBM Granite 13B · 19 Assets · Prototype Demo
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '11px 26px', fontSize: 14 }} onClick={() => nav('/command-center')}>
              ⚡ Open Command Center
            </button>
            <button className="btn btn-secondary" style={{ padding: '11px 26px', fontSize: 14 }} onClick={() => nav('/agents')}>
              🧠 Run WT-07 Demo
            </button>
            <button className="btn btn-secondary" style={{ padding: '11px 26px', fontSize: 14 }} onClick={() => nav('/copilot')}>
              🤖 AI Copilot
            </button>
            <button className="btn btn-secondary" style={{ padding: '11px 26px', fontSize: 14 }} onClick={() => nav('/alerts')}>
              🔔 Alert Center
            </button>
          </div>
        </div>

        {/* Energy flow diagram */}
        <div style={{ maxWidth: 680, margin: '52px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: 0 }}>
          {[
            { label: 'Solar', sub: '650 MW', icon: '☀️', color: 'var(--solar)' },
            null,
            { label: 'Wind', sub: '22.5 MW', icon: '🌬️', color: 'var(--wind)' },
            null,
            { label: 'AI Agents', sub: '6 agents', icon: '🧠', color: 'var(--accent)' },
            null,
            { label: 'Grid', sub: '440 MW cap', icon: '🔌', color: 'var(--accent-blue)' },
          ].map((node, i) =>
            node === null ? (
              <div key={i} style={{ color: 'var(--border)', fontSize: 18, padding: '0 6px' }}>→</div>
            ) : (
              <div key={i} style={{
                background: 'var(--surface)',
                border: `1px solid ${node.color}40`,
                borderRadius: 8, padding: '10px 16px', textAlign: 'center',
                minWidth: 80,
              }}>
                <div style={{ fontSize: 20 }}>{node.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: node.color, marginTop: 3 }}>{node.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 1 }}>{node.sub}</div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ─── Live Fleet Status Ticker ─────────────────────────────── */}
      <div style={{
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        padding: '12px 40px',
        display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center',
      }}>
        {[
          { label: 'Total Capacity', value: `${totalCapacity.toFixed(0)} MW`, color: 'var(--text)' },
          { label: 'Current Output', value: `${currentOutput.toFixed(0)} MW`, color: 'var(--accent)' },
          { label: 'Fleet Efficiency', value: `${fleetEfficiency}%`, color: Number(fleetEfficiency) > 85 ? 'var(--accent)' : 'var(--medium)' },
          { label: 'Online', value: `${onlineCount} / ${assets.length}`, color: 'var(--accent)' },
          { label: 'Offline / Maint.', value: String(offlineCount), color: offlineCount > 0 ? 'var(--critical)' : 'var(--text-muted)' },
          { label: 'Critical Risk', value: String(criticalCount), color: criticalCount > 0 ? 'var(--critical)' : 'var(--text-muted)' },
          { label: 'Active Alerts', value: String(activeAlerts), color: activeAlerts > 3 ? 'var(--high)' : 'var(--text-muted)' },
        ].map(stat => (
          <div key={stat.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: stat.color, fontVariantNumeric: 'tabular-nums' }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-subtle)', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/assets')}>📡 All Assets</button>
          <button className="btn btn-secondary btn-sm" onClick={() => nav('/alerts')}>🔔 Alerts ({activeAlerts})</button>
        </div>
      </div>

      {/* ─── AI Impact Metrics ────────────────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>AI IMPACT</div>
            <h2>Prototype Estimated Benefits</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
              Simulated impact — prototype estimates only, not measured real-world results
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
            {impacts.map(item => (
              <div key={item.metric} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--accent)', marginBottom: 6, fontVariantNumeric: 'tabular-nums' }}>{item.metric}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Five AI Agents ───────────────────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>AGENTIC AI ARCHITECTURE</div>
            <h2>Five Specialized AI Agents</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>Each agent handles a specific operational domain, collaborating in a multi-agent workflow. All powered by IBM Granite LLM.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
            {agentList.map((agent, i) => (
              <div key={agent.name} className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{agent.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Agent {i + 1}</div>
                    <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 14 }}>{agent.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>{agent.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => nav('/agents')}>View Agent Activity Timeline</button>
            <button className="btn btn-secondary" onClick={() => nav('/architecture')}>Platform Architecture</button>
            <button className="btn btn-secondary" onClick={() => nav('/copilot')}>Ask AI Copilot</button>
          </div>
        </div>
      </section>

      {/* ─── Demo Scenarios (Original 2) ─────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>INTERACTIVE DEMOS</div>
            <h2>Built-in Demo Scenarios</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>Run these end-to-end scenarios to see the full AI agent workflow in action</p>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="card" style={{ borderTop: '3px solid var(--accent-orange)' }}>
              <div style={{ fontSize: 11, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>SCENARIO 1</div>
              <h3 style={{ marginBottom: 10 }}>WT-07 Performance Anomaly</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                Weather Agent detects wind conditions (8.4 m/s) → Forecast Agent calculates expected output (2.05 MW) → Performance Agent identifies WT-07 at 1.68 MW (-18%) → Maintenance Agent assigns HIGH risk (72%) → Grid Agent evaluates impact → Dashboard Agent recommends inspection in 2–4 days.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => nav('/agents')}>Run Demo →</button>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--solar)' }}>
              <div style={{ fontSize: 11, color: 'var(--solar)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>SCENARIO 2</div>
              <h3 style={{ marginBottom: 10 }}>High Solar + Grid Constraint</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                Solar generation peaks at 485 MW → Grid capacity at 440 MW → Curtailment risk of 45 MW between 11:30–14:30 → Grid Agent recommends pre-charging storage by 11:00 + coordinated export → 8% curtailment reduction achieved.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => nav('/grid')}>View Grid →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Edge-Case Scenarios ──────────────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--critical)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>REAL-WORLD EDGE CASES</div>
            <h2>6 Real-World Failure Scenarios</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
              These scenarios model real events the Kutch–Banaskantha region faces. All are represented in live demo data — visible in Asset Monitoring, Alert Center, Generation Forecast, and Grid Optimization pages.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
            {edgeCaseScenarios.map(sc => (
              <div
                key={sc.id}
                className="card clickable"
                style={{
                  borderLeft: `3px solid ${sc.color}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onClick={() => setExpandedScenario(expandedScenario === sc.id ? null : sc.id)}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{sc.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
                        background: severityBg(sc.severity), color: severityColor(sc.severity),
                        border: `1px solid ${severityColor(sc.severity)}40`,
                        textTransform: 'uppercase', letterSpacing: '0.4px',
                      }}>{sc.severity}</span>
                      <span style={{ fontSize: 10, color: 'var(--text-subtle)' }}>{sc.region}</span>
                    </div>
                    <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{sc.title}</div>
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--text-subtle)', flexShrink: 0 }}>
                    {expandedScenario === sc.id ? '▲' : '▼'}
                  </span>
                </div>

                {/* Always visible: trigger + impact */}
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span style={{ fontWeight: 500, color: 'var(--text-subtle)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.4px' }}>TRIGGER: </span>
                  {sc.trigger}
                </div>
                <div style={{ fontSize: 12, color: sc.color, fontWeight: 500 }}>{sc.impact}</div>

                {/* Expandable: AI Response + Resolution */}
                {expandedScenario === sc.id && (
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 4 }}>🧠 AI Agent Response</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{sc.aiResponse}</div>
                    </div>
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 10, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, marginBottom: 4 }}>✅ Resolution</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6 }}>{sc.resolution}</div>
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-subtle)' }}>Asset: {sc.asset}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
            Click any card to see the full AI agent response and resolution. All scenarios are visible in live demo data.
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 16, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/alerts')}>🔔 See All 13 Alerts</button>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/assets')}>📡 Asset Monitoring</button>
            <button className="btn btn-secondary btn-sm" onClick={() => nav('/maintenance')}>🔧 Maintenance Risk Matrix</button>
          </div>
        </div>
      </section>

      {/* ─── Quick Nav ────────────────────────────────────────────── */}
      <section style={{ padding: '40px 40px 56px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h3 style={{ marginBottom: 20, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Explore the Platform</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            {[
              { path: '/command-center', icon: '⚡', label: 'Command Center' },
              { path: '/assets', icon: '📡', label: 'Asset Monitor' },
              { path: '/maintenance', icon: '🔧', label: 'Maintenance' },
              { path: '/forecast', icon: '📈', label: 'Forecasting' },
              { path: '/weather', icon: '🌤', label: 'Weather' },
              { path: '/grid', icon: '🔌', label: 'Grid Opt.' },
              { path: '/copilot', icon: '🤖', label: 'AI Copilot' },
              { path: '/agents', icon: '🧠', label: 'Agent Activity' },
              { path: '/alerts', icon: '🔔', label: 'Alert Center' },
              { path: '/map', icon: '🗺', label: 'Regional Map' },
              { path: '/architecture', icon: '🏗', label: 'Architecture' },
            ].map(item => (
              <button key={item.path} className="btn btn-secondary" style={{ flexDirection: 'column', padding: '14px 8px', height: 66, justifyContent: 'center', gap: 4 }} onClick={() => nav(item.path)}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                <span style={{ fontSize: 11 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '16px 40px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-subtle)' }}>
        <strong style={{ color: 'var(--text-muted)' }}>GreenPulse AI</strong> · Prototype · All data is simulated for demonstration purposes ·
        Kutch &amp; Banaskantha locations are representative, not verified field data ·
        Powered by IBM Granite LLM &amp; IBM Plex Sans
        <span style={{ display: 'block', marginTop: 4 }}>
          <a href="https://kyt47000.github.io/GreenPulse-AI/" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>
            🌐 Live Demo
          </a>
          {' · '}
          <span
            style={{ cursor: 'pointer', color: 'var(--accent-blue)' }}
            onClick={toggleTheme}
          >
            {theme === 'dark' ? '☀️ Switch to Light' : '🌙 Switch to Dark'}
          </span>
        </span>
      </div>
    </div>
  );
}
