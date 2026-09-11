import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Shared primitives ─────────────────────────────────────────────────────────

function ArchBox({ label, sub, color, icon, wide }: {
  label: string; sub: string; color: string; icon: string; wide?: boolean;
}) {
  return (
    <div style={{
      background: `${color}12`, border: `1px solid ${color}40`,
      borderRadius: 8, padding: '12px 24px', textAlign: 'center',
      width: wide ? '70%' : '45%',
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

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, color, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>
      {children}
    </div>
  );
}

// ── IBM Cloud service row ─────────────────────────────────────────────────────

interface IbmService {
  icon: string;
  service: string;
  tier: string;
  tierType: 'live' | 'free' | 'optional';
  detail: string;
  envKey?: string;
}

function ServiceRow({ item }: { item: IbmService }) {
  const tierColors = {
    live:     { bg: 'rgba(63,185,80,.12)',   color: 'var(--accent)',      border: 'rgba(63,185,80,.3)' },
    free:     { bg: 'rgba(63,185,80,.08)',   color: 'var(--accent)',      border: 'rgba(63,185,80,.2)' },
    optional: { bg: 'rgba(88,166,255,.10)',  color: 'var(--accent-blue)', border: 'rgba(88,166,255,.3)' },
  };
  const tc = tierColors[item.tierType];
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{item.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>{item.service}</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: tc.bg, color: tc.color, border: `1px solid ${tc.border}`, fontWeight: 600 }}>
            {item.tier}
          </span>
          {item.envKey && (
            <code style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'var(--surface)', border: '1px solid var(--border)', fontFamily: "'IBM Plex Mono', monospace", color: 'var(--text-muted)' }}>
              {item.envKey}
            </code>
          )}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>{item.detail}</div>
      </div>
    </div>
  );
}

// ── Data source switch card ───────────────────────────────────────────────────

function DataSourceSwitch() {
  const [active, setActive] = useState<'simulator' | 'ibm-live'>('simulator');
  return (
    <div className="card mb-16">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <SectionLabel color="var(--accent-blue)">Data Source Switch</SectionLabel>
          <h3 style={{ margin: 0 }}>One Variable. Two Modes.</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            Set <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>DATA_SOURCE</code> in <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>backend/.env</code> to switch the entire data pipeline — no code changes required.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className={`btn btn-sm ${active === 'simulator' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActive('simulator')}
          >🔄 simulator</button>
          <button
            className={`btn btn-sm ${active === 'ibm-live' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActive('ibm-live')}
          >☁️ ibm-live</button>
        </div>
      </div>

      {active === 'simulator' ? (
        <div>
          {/* .env block */}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}># backend/.env</div>
            <div><span style={{ color: 'var(--accent-blue)' }}>DATA_SOURCE</span>=<span style={{ color: 'var(--accent)' }}>simulator</span></div>
            <div style={{ color: 'var(--text-subtle)', marginTop: 6 }}># IBM_API_KEY and IBM_PROJECT_ID are optional in this mode</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { icon: '🔄', label: 'SCADA Simulator', desc: '19 assets with 3 s tick · Gaussian noise · deterministic escalation', color: 'var(--accent)' },
              { icon: '📡', label: 'SSE Stream', desc: 'Real-time push to frontend via GET /api/stream — no polling', color: 'var(--wind)' },
              { icon: '🧠', label: 'Edge-Case Injection', desc: 'WT-07 gearbox, HY-03 thermal, WT-10 SCADA loss, SF-06 dust storm', color: 'var(--medium)' },
              { icon: '🤖', label: 'Mock AI Mode', desc: 'AI Copilot returns deterministic responses — zero API cost', color: 'var(--text-muted)' },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: `1px solid ${item.color}30` }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(63,185,80,.06)', border: '1px solid rgba(63,185,80,.2)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            ✅ Works fully <strong style={{ color: 'var(--accent)' }}>offline</strong> — no IBM Cloud credentials required. Run <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>npm run dev</code> in <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>backend/</code> to start immediately.
          </div>
        </div>
      ) : (
        <div>
          {/* .env block */}
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '14px 16px', marginBottom: 14 }}>
            <div style={{ color: 'var(--text-muted)', marginBottom: 4 }}># backend/.env</div>
            <div><span style={{ color: 'var(--accent-blue)' }}>DATA_SOURCE</span>=<span style={{ color: 'var(--solar)' }}>ibm-live</span></div>
            <div><span style={{ color: 'var(--accent-blue)' }}>EVENT_STREAMS_BROKER</span>=<span style={{ color: 'var(--text-muted)' }}>broker-0-xxxx.kafka.svc.eventstreams.cloud.ibm.com:9093</span></div>
            <div><span style={{ color: 'var(--accent-blue)' }}>EVENT_STREAMS_API_KEY</span>=<span style={{ color: 'var(--text-muted)' }}>&lt;your-api-key&gt;</span></div>
            <div><span style={{ color: 'var(--accent-blue)' }}>DATABASE_URL</span>=<span style={{ color: 'var(--text-muted)' }}>postgresql://user:pass@host:5432/greenpulse?ssl=true</span></div>
            <div><span style={{ color: 'var(--accent-blue)' }}>IBM_API_KEY</span>=<span style={{ color: 'var(--text-muted)' }}>&lt;watsonx-api-key&gt;</span></div>
            <div><span style={{ color: 'var(--accent-blue)' }}>IBM_PROJECT_ID</span>=<span style={{ color: 'var(--text-muted)' }}>&lt;project-id&gt;</span></div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
            {[
              { icon: '📡', label: 'Event Streams (Kafka)', desc: 'Consumer reads greenpulse.asset-telemetry topic — each message updates liveState + emits SSE tick', color: 'var(--accent-blue)' },
              { icon: '🌦', label: 'Open-Meteo Weather', desc: 'Real irradiance + wind for lat 23.73, lon 69.86 — refreshed every 60 s automatically', color: 'var(--wind)' },
              { icon: '🗄', label: 'PostgreSQL Time-Series', desc: 'asset_telemetry table stores historical output — powers generation history charts', color: 'var(--solar)' },
              { icon: '🤖', label: 'IBM Granite 13B', desc: 'Real LLM responses via watsonx.ai · ibm/granite-13b-instruct-v2 · us-south endpoint', color: 'var(--accent)' },
            ].map(item => (
              <div key={item.label} style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: `1px solid ${item.color}30` }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(88,166,255,.06)', border: '1px solid rgba(88,166,255,.2)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)' }}>
            ☁️ The <strong style={{ color: 'var(--accent-blue)' }}>LiveBadge</strong> indicator in Command Center and Alert Center automatically shows <strong>☁️ IBM LIVE</strong> when this mode is active — forwarded via the SSE snapshot event. No frontend code changes needed.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function Architecture() {
  const nav = useNavigate();

  const ibmServices: IbmService[] = [
    {
      icon: '🤖', service: 'IBM Granite 13B', tier: 'Active (via .env)', tierType: 'live',
      envKey: 'IBM_API_KEY',
      detail: 'ibm/granite-13b-instruct-v2 served via IBM watsonx.ai REST API. Powers all five AI agents and the AI Copilot. Falls back to deterministic mock responses when IBM_API_KEY is not set — zero cost fallback.',
    },
    {
      icon: '☁️', service: 'IBM watsonx.ai', tier: 'Lite — Free', tierType: 'free',
      envKey: 'IBM_PROJECT_ID',
      detail: 'ML inference platform hosting Granite 13B. Token-based IAM authentication via IBM Cloud. Project ID required alongside API key. Free Lite tier supports the full demo workload.',
    },
    {
      icon: '📡', service: 'IBM Cloud Event Streams', tier: 'ibm-live mode', tierType: 'optional',
      envKey: 'EVENT_STREAMS_BROKER',
      detail: 'Apache Kafka 3.x managed service. Topic: greenpulse.asset-telemetry. Each Kafka message maps to one asset update — deserialized and merged into liveState, then emitted to all SSE clients as a tick event.',
    },
    {
      icon: '🗄', service: 'IBM Cloud Databases (PostgreSQL)', tier: 'ibm-live mode', tierType: 'optional',
      envKey: 'DATABASE_URL',
      detail: 'Time-series asset telemetry table (asset_telemetry). Replaces generateHistoricalGeneration() with a real SQL GROUP BY hour query. SSL enforced. Connection via DATABASE_URL (JDBC-compatible connection string).',
    },
    {
      icon: '⚡', service: 'IBM Cloud Code Engine', tier: 'Deploy target', tierType: 'optional',
      detail: 'Serverless container runtime for the Express backend. Scales to zero when idle. Set PORT, DATA_SOURCE, IBM_API_KEY, EVENT_STREAMS_*, and DATABASE_URL as Code Engine environment variables via the IBM Cloud console.',
    },
    {
      icon: '🌦', service: 'Open-Meteo API', tier: 'Fully Free', tierType: 'free',
      detail: 'No API key needed. Fetches real solar irradiance and wind speed for Kutch (lat 23.73°N, lon 69.86°E) every 60 s when DATA_SOURCE=ibm-live. Overrides the simulated weather values in liveState.',
    },
  ];

  return (
    <div>
      {/* ─── Header ──────────────────────────────────────────────────────── */}
      <div className="page-header">
        <h1>🏗 Platform Architecture</h1>
        <div className="page-subtitle">GreenPulse AI · Agentic AI system design · IBM Cloud &amp; Granite integration</div>
      </div>

      {/* ─── System Architecture Diagram ─────────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-16">System Architecture Overview</h3>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <ArchBox label="Operator / User" sub="Web Browser · Desktop / Mobile" color="var(--accent-blue)" icon="👤" />
          <Arrow />
          <ArchBox label="React Web Application" sub="React 18 · TypeScript · Vite · Recharts · useLiveStream SSE hook" color="var(--solar)" icon="⚛️" wide />
          <Arrow />
          <ArchBox label="Node.js / Express API" sub="REST endpoints · SSE /api/stream · CORS · dotenv config" color="var(--accent)" icon="🔗" wide />
          <Arrow />
          <ArchBox label="Agent Orchestrator" sub="Multi-agent coordinator · Tool dispatcher · Context manager" color="var(--accent-purple)" icon="🧠" wide />
          <Arrow />
          {/* IBM Granite */}
          <div style={{ background: 'rgba(88,166,255,.08)', border: '2px solid rgba(88,166,255,.4)', borderRadius: 10, padding: '16px 32px', textAlign: 'center', width: '60%' }}>
            <div style={{ fontSize: 16, marginBottom: 4 }}>🤖</div>
            <div style={{ fontWeight: 700, color: 'var(--accent-blue)', fontSize: 15 }}>IBM Granite 13B</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>ibm/granite-13b-instruct-v2 · IBM watsonx.ai · us-south region</div>
          </div>
          <Arrow />
          {/* Six agents */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            {[
              { name: 'Weather Agent',     color: 'var(--wind)',       icon: '🌤' },
              { name: 'Forecast Agent',    color: 'var(--solar)',      icon: '📈' },
              { name: 'Performance Agent', color: 'var(--medium)',     icon: '📡' },
              { name: 'Maintenance Agent', color: 'var(--high)',       icon: '🔧' },
              { name: 'Grid Agent',        color: 'var(--accent-blue)',icon: '🔌' },
              { name: 'Dashboard Agent',   color: 'var(--accent)',     icon: '⚡' },
            ].map(a => (
              <div key={a.name} style={{ background: `${a.color}18`, border: `1px solid ${a.color}40`, borderRadius: 8, padding: '8px 14px', textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: 14 }}>{a.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: a.color, marginTop: 2 }}>{a.name}</div>
              </div>
            ))}
          </div>
          <Arrow />
          {/* Data sources — split: simulator vs IBM Cloud */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}>
            {[
              { label: 'SCADA Simulator', sub: '19 assets · 3 s tick · Gaussian noise', icon: '🔄', color: 'var(--accent)' },
              { label: 'Event Streams', sub: 'Kafka · greenpulse.asset-telemetry', icon: '📡', color: 'var(--accent-blue)' },
              { label: 'Open-Meteo', sub: 'Real irradiance + wind · free API', icon: '🌦', color: 'var(--wind)' },
              { label: 'PostgreSQL', sub: 'Time-series telemetry history', icon: '🗄', color: 'var(--solar)' },
            ].map(d => (
              <div key={d.label} style={{ background: 'var(--surface2)', border: `1px solid ${d.color}30`, borderRadius: 8, padding: '10px 16px', textAlign: 'center', minWidth: 155 }}>
                <div style={{ fontSize: 16 }}>{d.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, color: d.color }}>{d.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{d.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Data Source Switch ───────────────────────────────────────────── */}
      <DataSourceSwitch />

      {/* ─── IBM Cloud Services ──────────────────────────────────────────── */}
      <div className="card mb-16">
        <div style={{ marginBottom: 20 }}>
          <SectionLabel color="var(--accent-blue)">IBM Cloud Integration</SectionLabel>
          <h3 style={{ margin: 0 }}>Services &amp; Configuration</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            All IBM Cloud services are wired through <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>backend/src/data/dataSourceAdapter.ts</code>.
            The routes never import from <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>simulator/</code> or <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>live/</code> directly — the adapter is the single switch point.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {ibmServices.map(item => <ServiceRow key={item.service} item={item} />)}
        </div>
      </div>

      {/* ─── Live Data Flow: Kafka → SSE → UI ────────────────────────────── */}
      <div className="card mb-16">
        <div style={{ marginBottom: 16 }}>
          <SectionLabel color="var(--accent-blue)">Real-Time Data Pipeline</SectionLabel>
          <h3 style={{ margin: 0 }}>Kafka → Backend → SSE → Frontend</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            The same pipeline runs in both modes — only the data source changes. The frontend SSE hook is identical.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { step: '1', label: 'SOURCE', icon: '📡', text: 'SCADA Simulator or IBM Kafka topic', color: 'var(--accent-blue)' },
            null,
            { step: '2', label: 'liveState', icon: '🔄', text: 'Mutable in-memory asset state (liveAssetState.ts)', color: 'var(--accent)' },
            null,
            { step: '3', label: 'sseEmitter', icon: '📤', text: 'Node EventEmitter emits tick event', color: 'var(--wind)' },
            null,
            { step: '4', label: 'SSE Route', icon: '🌐', text: 'GET /api/stream pushes to all clients', color: 'var(--solar)' },
            null,
            { step: '5', label: 'useLiveStream', icon: '⚛️', text: 'React hook updates assets + alerts state', color: 'var(--accent-purple)' },
            null,
            { step: '6', label: 'UI Re-render', icon: '🖥', text: 'Command Center + Alert Center re-render every 3 s', color: 'var(--medium)' },
          ].map((item, i) => {
            if (item === null) return <div key={i} style={{ display: 'flex', alignItems: 'center', color: 'var(--border)', fontSize: 20, padding: '0 6px' }}>→</div>;
            return (
              <div key={item.step} style={{ background: 'var(--surface2)', border: `1px solid ${item.color}30`, borderRadius: 8, padding: '12px 14px', textAlign: 'center', flex: 1, minWidth: 90 }}>
                <div style={{ fontSize: 18, marginBottom: 5 }}>{item.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: item.color, marginBottom: 3 }}>{item.label}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.text}</div>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>Tick interval:</strong> 3 000 ms (simulator) or per-message (Kafka). The SSE connection auto-reconnects with exponential back-off on disconnect. See <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>frontend/src/hooks/useLiveStream.ts</code> for the full implementation.
        </div>
      </div>

      {/* ─── Agent Tool Functions + Tech Stack ───────────────────────────── */}
      <div className="grid-2 mb-16">
        <div className="card">
          <h3 className="mb-12">Agent Tool Functions</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
            All routes import exclusively from <code style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>dataSourceAdapter.ts</code>. These are the callable tools exposed to each AI agent.
          </p>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, padding: 16 }}>
            {[
              'getAssets()',
              'getAssetDetails(assetId)',
              'getWeatherData()',
              'getGenerationHistory(days)',
              'getGenerationForecast()',
              'getMaintenanceRisk()',
              'getGridStatus()',
              'getAlerts()',
              'getLiveState()',
            ].map(fn => (
              <div key={fn} style={{ color: 'var(--accent)', marginBottom: 4 }}>{fn}</div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3 className="mb-12">Technology Stack</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { cat: 'AI / LLM', items: ['IBM Granite 13B (ibm/granite-13b-instruct-v2)', 'IBM watsonx.ai inference API', 'Multi-agent agentic architecture', 'Mock AI fallback (no-key mode)'], color: 'var(--accent-blue)' },
              { cat: 'Frontend', items: ['React 18 + TypeScript', 'Vite 5 + Recharts', 'React Router v6', 'useLiveStream SSE hook', 'IBM Plex Sans + Mono fonts'], color: 'var(--solar)' },
              { cat: 'Backend', items: ['Node.js + Express 4', 'TypeScript + ts-node', 'Server-Sent Events (SSE)', 'dataSourceAdapter pattern'], color: 'var(--accent)' },
              { cat: 'IBM Cloud', items: ['Event Streams (Kafka 3.x)', 'Databases for PostgreSQL', 'Code Engine (deploy target)', 'IAM API key authentication'], color: 'var(--wind)' },
            ].map(group => (
              <div key={group.cat} style={{ padding: '10px 12px', background: 'var(--surface2)', borderRadius: 6, border: `1px solid ${group.color}25` }}>
                <div style={{ fontSize: 11, color: group.color, fontWeight: 600, marginBottom: 6 }}>{group.cat}</div>
                {group.items.map(item => (
                  <div key={item} style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>• {item}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── AI Decision Flow ────────────────────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-12">Data → AI → Decision Flow</h3>
        <div style={{ display: 'flex', gap: 0, alignItems: 'stretch', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { step: '1', label: 'DATA', text: 'Asset telemetry, weather, grid status', color: 'var(--text-muted)', icon: '📊' },
            null,
            { step: '2', label: 'AI AGENTS', text: 'Multi-agent analysis & reasoning', color: 'var(--accent-blue)', icon: '🧠' },
            null,
            { step: '3', label: 'DETECTION', text: 'Anomaly & pattern recognition', color: 'var(--medium)', icon: '🔍' },
            null,
            { step: '4', label: 'PREDICTION', text: 'Failure risk & generation forecast', color: 'var(--solar)', icon: '🎯' },
            null,
            { step: '5', label: 'DECISION', text: 'Explainable recommendation', color: 'var(--accent)', icon: '✅' },
            null,
            { step: '6', label: 'ACTION', text: 'Operator executes, outcomes tracked', color: 'var(--high)', icon: '⚡' },
          ].map((item, i) => {
            if (item === null) return <div key={i} style={{ display: 'flex', alignItems: 'center', color: 'var(--border)', fontSize: 22, padding: '0 8px' }}>→</div>;
            return (
              <div key={item.step} style={{ background: 'var(--surface2)', border: `1px solid ${item.color}30`, borderRadius: 8, padding: '14px 16px', textAlign: 'center', flex: 1, minWidth: 90 }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: item.color, marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{item.text}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Code Engine Deployment ───────────────────────────────────────── */}
      <div className="card mb-16">
        <div style={{ marginBottom: 14 }}>
          <SectionLabel color="var(--accent-blue)">IBM Cloud Code Engine</SectionLabel>
          <h3 style={{ margin: 0 }}>Backend Deployment</h3>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
            The Express backend runs as a containerized Code Engine application. Environment variables are set via the IBM Cloud console — no Dockerfile secrets.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Runtime', value: 'Node.js 20 container', icon: '📦' },
            { label: 'Scale to zero', value: 'Scales down when idle — no idle cost', icon: '⚡' },
            { label: 'CORS origins', value: '*.github.io · *.codeengine.appdomain.cloud', icon: '🔗' },
            { label: 'Health check', value: 'GET /api/health → dataSource + AI mode', icon: '💚' },
          ].map(item => (
            <div key={item.label} style={{ padding: '12px 14px', background: 'var(--surface2)', borderRadius: 8, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 16, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text)' }}>{item.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 6, padding: '12px 14px', color: 'var(--text-muted)', lineHeight: 1.7 }}>
          <div style={{ color: 'var(--text-subtle)', marginBottom: 4 }}># Code Engine environment variables to set:</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>DATA_SOURCE</span>=ibm-live</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>IBM_API_KEY</span>=&lt;from IBM Cloud IAM&gt;</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>IBM_PROJECT_ID</span>=&lt;from watsonx.ai project&gt;</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>EVENT_STREAMS_BROKER</span>=&lt;broker endpoint&gt;</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>EVENT_STREAMS_API_KEY</span>=&lt;Event Streams key&gt;</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>DATABASE_URL</span>=&lt;PostgreSQL connection string&gt;</div>
          <div><span style={{ color: 'var(--accent-blue)' }}>PORT</span>=5000</div>
        </div>
      </div>

      {/* ─── Quick nav ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => nav('/command-center')}>⚡ Command Center</button>
        <button className="btn btn-secondary btn-sm" onClick={() => nav('/agents')}>🧠 Agent Activity</button>
        <button className="btn btn-secondary btn-sm" onClick={() => nav('/copilot')}>🤖 AI Copilot</button>
        <button className="btn btn-secondary btn-sm" onClick={() => nav('/assets')}>📡 Asset Monitor</button>
      </div>
    </div>
  );
}
