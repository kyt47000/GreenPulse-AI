import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

const SUGGESTED = [
  'Why is generation below forecast?',
  'Which asset is most likely to fail?',
  'Show today\'s maintenance priorities.',
  'Forecast tomorrow\'s renewable generation.',
  'What should we do during the evening peak?',
  'Why is WT-07 underperforming?',
  'Should we export or store excess energy this afternoon?',
  'Which turbine has the highest failure risk?',
];

const INITIAL: Message = {
  id: 'init',
  role: 'assistant',
  content: `**Welcome to GreenPulse AI Copilot** 🌿

I'm your intelligent renewable energy operations assistant for Kutch & Banaskantha, Gujarat.

**Current Status:**
- 14/16 assets online | Performance Score: 88.4%
- ⚠️ WT-07 (HIGH risk) — Gearbox degradation detected
- 🔴 WT-08 (CRITICAL) — Offline, maintenance in progress
- ⚠️ SF-04 — Inverter temperature trending high
- 📊 Total generation: ~572 MW | Daily forecast: 4,280 MWh

Ask me anything about your renewable energy assets, maintenance priorities, generation forecasts, or grid optimization.

*Powered by IBM Granite LLM · Mock engine active until credentials configured · All data is prototype demo data*`,
  timestamp: new Date().toISOString(),
  source: 'GreenPulse AI',
};

function formatMarkdown(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br/>');
}

export default function AICopilot() {
  const [messages, setMessages] = useState<Message[]>([INITIAL]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check backend availability
    axios.get('/api/health').then(() => setBackendAvailable(true)).catch(() => setBackendAvailable(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mock responses when backend is unavailable
  function getMockResponse(msg: string): string {
    const lower = msg.toLowerCase();
    if (lower.includes('wt-07') || lower.includes('underperform') || lower.includes('why') && lower.includes('generat')) {
      return `**WT-07 Performance Analysis** *(Prototype Data)*

**WHAT:** WT-07 is generating 1.68 MW vs expected 2.05 MW — an 18% deficit under current wind conditions (8.4 m/s).

**WHY:** Vibration sensor reads 0.89 (threshold: 0.65) — 37% above safe operating range. RPM has dropped to 10.4 vs rated 14.2. This pattern is consistent with gearbox bearing wear or oil degradation. Health score: 61% (down from 81% 7 days ago).

**ACTION:** Schedule gearbox inspection within 2–4 days. Check gearbox oil viscosity, bearing temperatures, and gear mesh alignment.

**CONFIDENCE:** 87%

*Prototype data — simulated for demonstration purposes.*`;
    }
    if (lower.includes('maintenance') || lower.includes('inspect') || lower.includes('priorit')) {
      return `**Today's Maintenance Priorities** *(Prototype Data)*

🔴 **CRITICAL — WT-08** (Banaskantha) — Offline. Emergency drivetrain replacement in progress.

🟠 **HIGH — WT-07** (Banaskantha) — Gearbox vibration 23% above baseline. Failure risk: 72%. Inspect within 2–4 days.

🟡 **MEDIUM — SF-04** (Deesa Solar Array) — Inverter INV-12 temperature rising. Inspect within 5–7 days.

🟡 **MEDIUM — WT-05** (Bhuj) — Blade vibration trending up. Inspect pitch control within 7–10 days.

🟢 **LOW — SF-02** (Mundra Solar Park) — Panel soiling. Schedule cleaning in 14–21 days.

*Prototype data — simulated for demonstration purposes.*`;
    }
    if (lower.includes('forecast') || lower.includes('tomorrow') || lower.includes('generat')) {
      return `**Tomorrow's Generation Forecast** *(Prototype Data)*

**Solar:** Expected peak of ~485 MW at approximately 12:30. Cloud cover forecast after 14:00 will reduce afternoon output by 12–14%.

**Wind:** Steady 28–32 MW throughout the day. Slight increase from northwest winds in the evening.

**Combined Daily:** ~4,280 MWh total. Curtailment risk at peak solar hours — pre-charging storage recommended by 11:00.

*Prototype data — simulated for demonstration purposes.*`;
    }
    if (lower.includes('grid') || lower.includes('export') || lower.includes('storage') || lower.includes('evening') || lower.includes('excess')) {
      return `**Grid Optimization Recommendation** *(Prototype Data)*

**ACTION: Prioritize Grid Export + Pre-Charge Storage**

Between 11:30–14:30, solar peak generation forecast to reach 485 MW exceeds grid export capacity (440 MW), creating ~45 MW curtailment risk.

**Recommended steps:**
1. Begin pre-charging battery storage by 11:00 (28 MW available)
2. Maximize export to 440 MW grid limit
3. After 14:00: reduce export as solar drops; use stored energy for evening demand peak

**Expected Benefit:** Reduce curtailment by ~43 MW (8% of peak generation). Confidence: 89%.

*Prototype data — simulated for demonstration purposes.*`;
    }
    if (lower.includes('fail') || lower.includes('risk') || lower.includes('worst') || lower.includes('highest')) {
      return `**Highest Failure Risk** *(Prototype Data)*

🔴 **WT-08** (CRITICAL — offline): Health 22%, Failure Risk 96% — drivetrain failure, currently under repair.

🟠 **WT-07** (HIGH): Health 61%, Failure Risk 72% — gearbox degradation, still operating. Immediate inspection recommended.

🟡 **SF-04** (MEDIUM): Health 78%, Failure Risk 48% — inverter thermal issue.

*If prioritizing resources: WT-07 requires urgent attention as it is still operating with high failure risk and may escalate to complete failure.*

*Prototype data — simulated for demonstration purposes.*`;
    }
    return `**GreenPulse AI Response** *(Prototype Data)*

Based on current platform data:
- 14/16 assets online | Performance Score: 88.4%
- Total generation: ~572 MW
- 2 HIGH priority assets requiring attention (WT-07, SF-04)
- 1 CRITICAL asset offline (WT-08)

**Key Recommendation:** Focus on WT-07 gearbox inspection (2–4 day window) and SF-04 inverter temperature check (72-hour window).

Please ask a more specific question about assets, maintenance, forecast, or grid optimization for detailed analysis.

*Connect IBM Granite credentials in .env for enhanced AI responses · Prototype demo data*`;
  }

  async function sendMessage(msg?: string) {
    const text = (msg || input).trim();
    if (!text) return;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      let content: string;
      let source: string;

      if (backendAvailable) {
        const res = await axios.post('/api/ai/chat', { message: text });
        content = res.data.content;
        source = res.data.source;
      } else {
        await new Promise(r => setTimeout(r, 800)); // simulate latency
        content = getMockResponse(text);
        source = 'GreenPulse Mock Engine (backend offline)';
      }

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        source,
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: getMockResponse(text),
        timestamp: new Date().toISOString(),
        source: 'GreenPulse Mock Engine',
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)' }}>
      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="page-header" style={{ paddingBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🤖</span>
          <div>
            <h1>GreenPulse AI Copilot</h1>
            <div className="page-subtitle">Intelligent renewable energy operations assistant · IBM Granite LLM</div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 4, background: backendAvailable === true ? 'rgba(63,185,80,.15)' : backendAvailable === false ? 'rgba(227,179,65,.15)' : 'var(--surface2)', color: backendAvailable === true ? 'var(--accent)' : 'var(--medium)', border: '1px solid currentColor' }}>
              {backendAvailable === true ? '✅ Backend Connected' : backendAvailable === false ? '⚠️ Mock Mode' : '◌ Checking...'}
            </span>
          </div>
        </div>
      </div>

      {/* ─── Messages ────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 0 16px', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 0 }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{
              maxWidth: '78%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
              background: msg.role === 'user' ? 'var(--accent-blue)' : 'var(--surface)',
              border: msg.role === 'assistant' ? '1px solid var(--border)' : 'none',
              fontSize: 13,
              lineHeight: 1.7,
            }}>
              {msg.role === 'assistant' && (
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 6 }}>
                  🤖 {msg.source || 'GreenPulse AI'} · {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              )}
              <div dangerouslySetInnerHTML={{ __html: formatMarkdown(msg.content) }} />
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex' }}>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 2px', padding: '12px 16px', fontSize: 13, color: 'var(--text-muted)' }}>
              <span style={{ animation: 'pulse 1s infinite' }}>🤖 Analyzing data</span> ·&#32;
              <span style={{ fontFamily: 'monospace' }}>■ ■ ■</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ─── Suggested Prompts ───────────────────────────────── */}
      <div style={{ padding: '10px 0', borderTop: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>Suggested questions:</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SUGGESTED.slice(0, 4).map(s => (
            <button key={s} className="btn btn-secondary btn-sm" style={{ fontSize: 11 }} onClick={() => sendMessage(s)} disabled={loading}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Input ───────────────────────────────────────────── */}
      <div style={{ padding: '10px 0 0', display: 'flex', gap: 10 }}>
        <input
          className="chat-input"
          placeholder="Ask about assets, maintenance, forecast, grid optimization..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          disabled={loading}
          style={{ flex: 1 }}
        />
        <button className="btn btn-primary" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
          {loading ? '⏳' : 'Send ▶'}
        </button>
      </div>
    </div>
  );
}
