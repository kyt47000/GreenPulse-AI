import React from 'react';

export default function Architecture() {
  return (
    <div>
      <div className="page-header">
        <h1>🏗 Platform Architecture</h1>
        <div className="page-subtitle">GreenPulse AI — Agentic AI system design · IBM Cloud &amp; Granite integration</div>
      </div>

      {/* ─── Architecture Diagram ─────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-16">System Architecture Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          {/* Layer 1: User */}
          <ArchBox label="Operator / User" sub="Web Browser · Desktop / Mobile" color="var(--accent-blue)" icon="👤" />
          <Arrow />

          {/* Layer 2: Frontend */}
          <ArchBox label="React Web Application" sub="React 18 · TypeScript · Vite · Recharts · Zustand" color="var(--solar)" icon="⚛️" wide />
          <Arrow />

          {/* Layer 3: API */}
          <ArchBox label="Application API" sub="Node.js · Express · REST endpoints · CORS" color="var(--accent)" icon="🔗" wide />
          <Arrow />

          {/* Layer 4: Orchestrator */}
          <ArchBox label="Agent Orchestrator" sub="Multi-agent coordinator · Tool dispatcher · Context manager" color="var(--accent-purple)" icon="🧠" wide />
          <Arrow />

          {/* Layer 5: IBM Granite */}
          <div style={{ background: 'rgba(88,166,255,.08)', border: '2px solid rgba(88,166,255,.4)', borderRadius: 10, padding: '16px 32px', textAlign: 'center', width: '60%', marginBottom: 0 }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>🤖</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: 15 }}>IBM Granite LLM</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>ibm/granite-13b-instruct-v2 · IBM watsonx.ai · IBM Cloud us-south</div>
          </div>
          <Arrow />

          {/* Layer 6: Agents */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', width: '100%', marginBottom: 0 }}>
            {[
              { name: 'Weather Agent', color: 'var(--wind)', icon: '🌤' },
              { name: 'Forecast Agent', color: 'var(--solar)', icon: '📈' },
              { name: 'Performance Agent', color: 'var(--medium)', icon: '📡' },
              { name: 'Maintenance Agent', color: 'var(--high)', icon: '🔧' },
              { name: 'Grid Agent', color: 'var(--accent-blue)', icon: '🔌' },
              { name: 'Dashboard Agent', color: 'var(--accent)', icon: '⚡' },
            ].map(a => (
              <div key={a.name} style={{ background: `${a.color}18`, border: `1px solid ${a.color}40`, borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: 14 }}>{a.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: a.color, marginTop: 2 }}>{a.name}</div>
              </div>
            ))}
          </div>
          <Arrow />

          {/* Layer 7: Data */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            {[
              { label: 'Asset Data', sub: '16 assets · telemetry · sensor signals', icon: '📡' },
              { label: 'Weather Data', sub: 'Irradiance · wind · cloud · humidity', icon: '🌤' },
              { label: 'Grid Data', sub: 'Generation · demand · export · storage', icon: '🔌' },
              { label: 'Maintenance', sub: 'Health scores · failure risk · history', icon: '🔧' },
            ].map(d => (
              <div key={d.label} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 16px', textAlign: 'center', minWidth: 160 }}>
                <div style={{ fontSize: 16 }}>{d.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{d.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{d.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Agent Tool Design ─────────────────────────────────── */}
      <div className="grid-2 mb-16">
        <div className="card">
          <h3 className="mb-12">Agent Tool Functions</h3>
          <div style={{ fontFamily: 'monospace', fontSize: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: 16 }}>
            {[
              'getAssetPerformance()',
              'getAssetDetails(assetId)',
              'getMaintenanceRisk()',
              'getWeatherForecast(region)',
              'getGenerationForecast(hours)',
              'getGridStatus()',
              'getAlerts(severity?)',
              'getGenerationHistory(days)',
            ].map(fn => (
              <div key={fn} style={{ color: 'var(--accent)', marginBottom: 4 }}>{fn}</div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="mb-12">IBM Cloud Integration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { service: 'IBM Granite LLM', detail: 'ibm/granite-13b-instruct-v2 via watsonx.ai', status: 'configured-via-env' },
              { service: 'IBM watsonx.ai', detail: 'ML model inference · Text generation API', status: 'configured-via-env' },
              { service: 'IBM Cloud IAM', detail: 'API key authentication · Token refresh', status: 'configured-via-env' },
              { service: 'IBM Cloud Code Engine', detail: 'Containerized deployment target', status: 'deployment' },
              { service: 'IBM Cloud Object Storage', detail: 'Asset data persistence (future)', status: 'future' },
            ].map(item => (
              <div key={item.service} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px', background: 'var(--surface2)', borderRadius: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{item.service}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.detail}</div>
                </div>
                <span className={`badge ${item.status === 'deployment' ? 'badge-medium' : item.status === 'future' ? 'badge-online' : 'badge-low'}`} style={{ fontSize: 10 }}>
                  {item.status === 'configured-via-env' ? 'via .env' : item.status === 'deployment' ? 'deploy target' : 'roadmap'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Tech Stack ────────────────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-12">Technology Stack</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { cat: 'AI/LLM', items: ['IBM Granite 13B', 'watsonx.ai API', 'Agentic Architecture', 'Mock AI Fallback'] },
            { cat: 'Frontend', items: ['React 18', 'TypeScript', 'Vite', 'Recharts', 'React Router'] },
            { cat: 'Backend', items: ['Node.js', 'Express', 'TypeScript', 'REST API'] },
            { cat: 'State & Data', items: ['Zustand', 'Demo JSON data', 'date-fns', 'Axios'] },
            { cat: 'Cloud & Deploy', items: ['IBM Cloud', 'Code Engine', 'GitHub Actions', 'dotenv secrets'] },
          ].map(group => (
            <div key={group.cat} style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, color: 'var(--accent-blue)', fontWeight: 600, marginBottom: 8 }}>{group.cat}</div>
              {group.items.map(item => (
                <div key={item} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 3 }}>• {item}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ─── Data Flow ─────────────────────────────────────────── */}
      <div className="card">
        <h3 className="mb-12">Data → AI → Decision Flow</h3>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { step: '1', label: 'DATA', text: 'Asset telemetry, weather, grid status', color: 'var(--text-muted)', icon: '📊' },
            { step: '→', label: '', text: '', color: '', icon: '' },
            { step: '2', label: 'AI AGENTS', text: 'Multi-agent analysis & reasoning', color: 'var(--accent-blue)', icon: '🧠' },
            { step: '→', label: '', text: '', color: '', icon: '' },
            { step: '3', label: 'DETECTION', text: 'Anomaly & pattern recognition', color: 'var(--medium)', icon: '🔍' },
            { step: '→', label: '', text: '', color: '', icon: '' },
            { step: '4', label: 'PREDICTION', text: 'Failure risk & generation forecast', color: 'var(--solar)', icon: '🎯' },
            { step: '→', label: '', text: '', color: '', icon: '' },
            { step: '5', label: 'DECISION', text: 'Explainable recommendation', color: 'var(--accent)', icon: '✅' },
            { step: '→', label: '', text: '', color: '', icon: '' },
            { step: '6', label: 'ACTION', text: 'Operator executes, outcomes tracked', color: 'var(--high)', icon: '⚡' },
          ].map((item, i) => {
            if (item.step === '→') return <div key={i} style={{ display: 'flex', alignItems: 'center', color: 'var(--border)', fontSize: 22, padding: '0 8px' }}>→</div>;
            return (
              <div key={item.step} style={{ background: 'var(--surface2)', border: `1px solid ${item.color}40`, borderRadius: 8, padding: '14px 16px', textAlign: 'center', flex: '1', minWidth: 90 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.text}</div>
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', textAlign: 'center', marginTop: 16 }}>
          GreenPulse AI Prototype · All data simulated · IBM Granite LLM integration via watsonx.ai
        </div>
      </div>
    </div>
  );
}

function ArchBox({ label, sub, color, icon, wide }: any) {
  return (
    <div style={{
      background: `${color}12`,
      border: `1px solid ${color}40`,
      borderRadius: 8,
      padding: '12px 24px',
      textAlign: 'center',
      width: wide ? '70%' : '45%',
      marginBottom: 0,
    }}>
      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontWeight: 600, color }}>{label}</div>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function Arrow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 28, color: 'var(--border)', fontSize: 22 }}>↓</div>
  );
}
