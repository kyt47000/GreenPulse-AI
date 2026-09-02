import React from 'react';
import { useNavigate } from 'react-router-dom';

const agents = [
  { icon: '📡', name: 'Asset Performance', desc: 'Monitors 16 renewable assets, detects anomalies, calculates performance scores' },
  { icon: '🔧', name: 'Predictive Maintenance', desc: 'Analyzes vibration, temperature, RPM to predict failures before they occur' },
  { icon: '📈', name: 'Generation Forecast', desc: 'Predicts solar and wind output using weather patterns and historical data' },
  { icon: '🌤', name: 'Weather Intelligence', desc: 'Interprets weather data and quantifies impact on renewable generation' },
  { icon: '🔌', name: 'Grid Optimization', desc: 'Evaluates export, storage and curtailment strategies in real time' },
];

const impacts = [
  { metric: '~3.5×', label: 'Faster Anomaly Detection', sub: 'vs manual inspection cycles' },
  { metric: '72%', label: 'Failure Risk Identified Early', sub: 'WT-07 scenario — prototype estimate' },
  { metric: '~8%', label: 'Curtailment Reduction Potential', sub: 'grid optimization scenario' },
  { metric: '4,280 MWh', label: 'Daily Generation Forecast', sub: 'AI-predicted — demo data' },
];

export default function Home() {
  const nav = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* ─── Hero ─────────────────────────────────────────────── */}
      <section style={{ background: 'linear-gradient(180deg, #0d1117 0%, #111820 100%)', borderBottom: '1px solid var(--border)', padding: '80px 40px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(63,185,80,.1)', border: '1px solid rgba(63,185,80,.2)', borderRadius: 20, padding: '5px 14px', marginBottom: 24, fontSize: 12, color: 'var(--accent)' }}>
            <span>🌿</span> Agentic AI for Renewable Energy Intelligence
          </div>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ color: 'var(--accent)' }}>GreenPulse</span> AI
          </h1>
          <p style={{ fontSize: 18, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.7 }}>
            Monitor renewable assets. Predict failures. Forecast generation. Optimize grid integration.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-subtle)', marginBottom: 36 }}>
            Kutch &amp; Banaskantha, Gujarat, India · IBM Granite LLM · Prototype Demo
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => nav('/command-center')}>
              ⚡ Open Command Center
            </button>
            <button className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => nav('/agents')}>
              🧠 Explore AI Agents
            </button>
            <button className="btn btn-secondary" style={{ padding: '12px 28px', fontSize: 15 }} onClick={() => nav('/copilot')}>
              🤖 AI Copilot
            </button>
          </div>
        </div>

        {/* Energy flow diagram */}
        <div style={{ maxWidth: 700, margin: '48px auto 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0, flexWrap: 'wrap' }}>
          {[
            { label: 'Solar', icon: '☀️', color: 'var(--solar)' },
            { label: '→', icon: '', color: 'var(--text-subtle)' },
            { label: 'Wind', icon: '🌬️', color: 'var(--wind)' },
            { label: '→', icon: '', color: 'var(--text-subtle)' },
            { label: 'AI Agents', icon: '🧠', color: 'var(--accent)' },
            { label: '→', icon: '', color: 'var(--text-subtle)' },
            { label: 'Grid', icon: '🔌', color: 'var(--accent-blue)' },
          ].map((node, i) => (
            node.label === '→' ? (
              <div key={i} style={{ color: 'var(--border)', fontSize: 20, padding: '0 8px' }}>→</div>
            ) : (
              <div key={i} style={{ background: 'var(--surface)', border: `1px solid ${node.color}40`, borderRadius: 8, padding: '10px 18px', textAlign: 'center' }}>
                <div style={{ fontSize: 22 }}>{node.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: node.color, marginTop: 4 }}>{node.label}</div>
              </div>
            )
          ))}
        </div>
      </section>

      {/* ─── AI Impact ──────────────────────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>AI IMPACT</div>
            <h2>Prototype Estimated Benefits</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>
              Simulated impact — prototype estimates only, not measured real-world results
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            {impacts.map(item => (
              <div key={item.metric} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: 'var(--accent)', marginBottom: 6 }}>{item.metric}</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Five Agents ────────────────────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>AGENTIC AI ARCHITECTURE</div>
            <h2>Five Specialized AI Agents</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 6 }}>Each agent handles a specific operational domain, collaborating in a multi-agent workflow</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 14 }}>
            {agents.map((agent, i) => (
              <div key={agent.name} className="card" style={{ borderLeft: '3px solid var(--accent)' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 24 }}>{agent.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-subtle)', marginBottom: 2 }}>Agent {i + 1}</div>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{agent.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{agent.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => nav('/agents')}>View Agent Activity Timeline</button>
            <button className="btn btn-secondary" onClick={() => nav('/architecture')}>Platform Architecture</button>
          </div>
        </div>
      </section>

      {/* ─── Demo Scenarios ─────────────────────────────────────── */}
      <section style={{ padding: '48px 40px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>DEMO SCENARIOS</div>
            <h2>Hackathon Demo Workflows</h2>
          </div>
          <div className="grid-2" style={{ gap: 16 }}>
            <div className="card" style={{ borderTop: '3px solid var(--accent-orange)' }}>
              <div style={{ fontSize: 11, color: 'var(--accent-orange)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>SCENARIO 1</div>
              <h3 style={{ marginBottom: 10 }}>WT-07 Performance Anomaly</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                Weather Agent detects wind conditions → Forecast Agent calculates expected output → Performance Agent identifies WT-07 18% below forecast → Maintenance Agent assigns HIGH risk → Grid Agent evaluates impact → Dashboard Agent recommends inspection.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => nav('/agents')}>Run Demo →</button>
            </div>
            <div className="card" style={{ borderTop: '3px solid var(--solar)' }}>
              <div style={{ fontSize: 11, color: 'var(--solar)', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 10 }}>SCENARIO 2</div>
              <h3 style={{ marginBottom: 10 }}>High Solar + Grid Constraint</h3>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                Solar generation peaks at 485 MW → Grid capacity at 440 MW → Curtailment risk of 45 MW → Grid Agent recommends pre-charging storage + coordinated export → 8% curtailment reduction achieved.
              </p>
              <button className="btn btn-secondary btn-sm" onClick={() => nav('/grid')}>View Grid →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Quick Nav ───────────────────────────────────────────── */}
      <section style={{ padding: '40px 40px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h3 style={{ marginBottom: 20, textAlign: 'center', color: 'var(--text-muted)' }}>Explore the Platform</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
            {[
              { path: '/command-center', icon: '⚡', label: 'Command Center' },
              { path: '/assets', icon: '📡', label: 'Asset Monitor' },
              { path: '/maintenance', icon: '🔧', label: 'Maintenance' },
              { path: '/forecast', icon: '📈', label: 'Forecasting' },
              { path: '/weather', icon: '🌤', label: 'Weather' },
              { path: '/grid', icon: '🔌', label: 'Grid Opt.' },
              { path: '/copilot', icon: '🤖', label: 'AI Copilot' },
              { path: '/map', icon: '🗺', label: 'Regional Map' },
            ].map(item => (
              <button key={item.path} className="btn btn-secondary" style={{ flexDirection: 'column', padding: '16px 10px', height: 70, justifyContent: 'center' }} onClick={() => nav(item.path)}>
                <span style={{ fontSize: 18, marginBottom: 4 }}>{item.icon}</span>
                <span style={{ fontSize: 11 }}>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer disclaimer ───────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '16px 40px', borderTop: '1px solid var(--border)', fontSize: 11, color: 'var(--text-subtle)' }}>
        <strong style={{ color: 'var(--text-muted)' }}>GreenPulse AI</strong> · Prototype · All data is simulated for demonstration purposes · Kutch &amp; Banaskantha locations are representative, not verified field data · Powered by IBM Granite LLM
      </div>
    </div>
  );
}
