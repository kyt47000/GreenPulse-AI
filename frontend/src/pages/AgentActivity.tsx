import React, { useState, useEffect } from 'react';
import { agents, generateAgentEvents } from '../data/demoData';
import type { AgentEvent } from '../types';

const agentColors: Record<string, string> = {
  'weather-agent': 'var(--wind)',
  'forecast-agent': 'var(--solar)',
  'performance-agent': 'var(--medium)',
  'maintenance-agent': 'var(--high)',
  'grid-agent': 'var(--accent-blue)',
  'dashboard-agent': 'var(--accent)',
};

const statusColors: Record<string, string> = {
  idle: 'var(--text-subtle)',
  analyzing: 'var(--accent-blue)',
  completed: 'var(--accent)',
  warning: 'var(--medium)',
};

export default function AgentActivity() {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [running, setRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [agentStates, setAgentStates] = useState<Record<string, string>>({});

  useEffect(() => {
    setEvents(generateAgentEvents());
  }, []);

  async function runWT07Demo() {
    setRunning(true);
    setActiveStep(-1);
    const allAgents = ['weather-agent', 'forecast-agent', 'performance-agent', 'maintenance-agent', 'grid-agent', 'dashboard-agent'];
    const newStates: Record<string, string> = {};
    allAgents.forEach(a => { newStates[a] = 'idle'; });
    setAgentStates({ ...newStates });
    await new Promise(r => setTimeout(r, 500));

    for (let i = 0; i < events.length; i++) {
      const event = events[i];
      setActiveStep(i);
      setAgentStates(prev => ({ ...prev, [event.agentId]: 'analyzing' }));
      await new Promise(r => setTimeout(r, 1200));
      setAgentStates(prev => ({ ...prev, [event.agentId]: event.severity === 'warning' ? 'warning' : 'completed' }));
      await new Promise(r => setTimeout(r, 400));
    }
    setRunning(false);
  }

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <h1>🧠 Agent Activity</h1>
          <button className="btn btn-primary btn-sm" onClick={runWT07Demo} disabled={running}>
            {running ? '⏳ Running Demo...' : '▶ Run WT-07 Demo Scenario'}
          </button>
        </div>
        <div className="page-subtitle">
          Multi-agent AI orchestration · Real-time collaboration timeline · <span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype demo data</span>
        </div>
      </div>

      {/* ─── Agent Cards ─────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
        {agents.map((agent, i) => {
          const state = agentStates[agent.id] || agent.status;
          const color = agentColors[agent.id] || 'var(--accent)';
          return (
            <div key={agent.id} className={`card agent-card status-${state}`} style={{ borderTop: `2px solid ${color}`, transition: 'border-color 0.3s' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ marginTop: 3 }}>
                  <span className={`agent-pulse pulse-${state}`} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>Agent {i + 1}: {agent.name}</div>
                    <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 4, background: `${statusColors[state]}20`, color: statusColors[state], fontWeight: 600 }}>
                      {state.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 8 }}>{agent.description}</div>
                  <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text-subtle)' }}>
                    <span>🔍 {agent.analysisCount.toLocaleString()} analyses</span>
                    <span>🔔 {agent.alertsGenerated} alerts</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 4 }}>Last run: {agent.lastRun}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─── Workflow Diagram ─────────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-12">Multi-Agent Orchestration Flow</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '8px 0', flexWrap: 'wrap', justifyContent: 'center' }}>
          {agents.slice(0, 6).map((agent, i) => {
            const isActive = activeStep === i;
            const isDone = activeStep > i;
            const color = agentColors[agent.id];
            return (
              <React.Fragment key={agent.id}>
                <div style={{
                  padding: '10px 14px',
                  background: isDone ? `${color}20` : isActive ? `${color}30` : 'var(--surface2)',
                  border: `1px solid ${isActive || isDone ? color : 'var(--border)'}`,
                  borderRadius: 8,
                  textAlign: 'center',
                  transition: 'all 0.3s',
                  minWidth: 110,
                }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: isActive || isDone ? color : 'var(--text-muted)' }}>
                    {isDone ? '✓' : isActive ? '▶' : `${i + 1}`}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, marginTop: 2 }}>{agent.name.replace(' Agent', '')}</div>
                </div>
                {i < agents.length - 1 && (
                  <div style={{ color: activeStep > i ? 'var(--accent)' : 'var(--border)', fontSize: 18, padding: '0 6px', transition: 'color 0.3s' }}>→</div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ─── Event Timeline ──────────────────────────────────── */}
      <div className="card">
        <div className="card-header">
          <h3>Agent Reasoning Timeline</h3>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>WT-07 Demo Scenario</span>
        </div>
        <div className="timeline">
          {events.map((event, i) => {
            const color = agentColors[event.agentId] || 'var(--accent)';
            const isActive = activeStep === i;
            return (
              <div key={event.id} className="timeline-item" style={{
                background: isActive ? 'var(--surface2)' : 'transparent',
                borderRadius: 6,
                padding: '12px 8px',
                transition: 'background 0.3s',
                borderLeft: isActive ? `3px solid ${color}` : '3px solid transparent',
                margin: '2px 0',
              }}>
                <div style={{
                  width: 10, height: 10, borderRadius: '50%',
                  background: isActive ? color : activeStep > i ? 'var(--accent)' : 'var(--border)',
                  marginTop: 4, flexShrink: 0, transition: 'background 0.3s',
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 4 }}>
                    <span className="timeline-meta">{event.timestamp}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color }}>{event.agentName}</span>
                    {event.severity === 'warning' && <span className="badge badge-medium" style={{ fontSize: 9 }}>WARNING</span>}
                  </div>
                  <div className="timeline-action">{event.action}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, lineHeight: 1.5 }}>
                    <strong>Input:</strong> {event.input}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text)', marginTop: 4, lineHeight: 1.5 }}>
                    <strong>Result:</strong> {event.result}
                  </div>
                  {event.nextAgent && (
                    <div style={{ fontSize: 11, color: 'var(--accent)', marginTop: 4 }}>
                      → Passed to: {event.nextAgent}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
