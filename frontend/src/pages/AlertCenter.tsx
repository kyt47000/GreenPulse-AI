import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alerts as initialAlerts } from '../data/demoData';
import type { Alert } from '../types';

const severityOrder: Record<string, number> = { critical: 0, high: 1, warning: 2, info: 3 };

export default function AlertCenter() {
  const nav = useNavigate();
  const [alertList, setAlertList] = useState<Alert[]>([...initialAlerts]);
  const [catFilter, setCatFilter] = useState('all');
  const [sevFilter, setSevFilter] = useState('all');
  const [showResolved, setShowResolved] = useState(false);

  const filtered = alertList
    .filter(a => catFilter === 'all' || a.category === catFilter)
    .filter(a => sevFilter === 'all' || a.severity === sevFilter)
    .filter(a => showResolved || !a.resolved)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  function acknowledge(id: string) {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }
  function resolve(id: string) {
    setAlertList(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  }

  const counts = {
    critical: alertList.filter(a => a.severity === 'critical' && !a.resolved).length,
    high: alertList.filter(a => a.severity === 'high' && !a.resolved).length,
    warning: alertList.filter(a => a.severity === 'warning' && !a.resolved).length,
    info: alertList.filter(a => a.severity === 'info' && !a.resolved).length,
  };

  return (
    <div>
      <div className="page-header">
        <h1>🔔 Alert Center</h1>
        <div className="page-subtitle">
          {counts.critical} critical · {counts.high} high · {counts.warning} warning · {counts.info} info · unresolved
          &nbsp;·&nbsp;<span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype demo data</span>
        </div>
      </div>

      {/* ─── Summary ─────────────────────────────────────────── */}
      <div className="grid-4 mb-16">
        {[
          { label: 'Critical', count: counts.critical, color: 'var(--critical)', badge: 'badge-critical' },
          { label: 'High', count: counts.high, color: 'var(--high)', badge: 'badge-high' },
          { label: 'Warning', count: counts.warning, color: 'var(--medium)', badge: 'badge-medium' },
          { label: 'Info', count: counts.info, color: 'var(--accent-blue)', badge: 'badge-online' },
        ].map(item => (
          <div key={item.label} className="card card-sm" style={{ textAlign: 'center', borderTop: `2px solid ${item.color}` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: item.color }}>{item.count}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{item.label}</div>
          </div>
        ))}
      </div>

      {/* ─── Filters ─────────────────────────────────────────── */}
      <div className="filter-bar mb-16">
        <select className="filter-select" value={catFilter} onChange={e => setCatFilter(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="performance">Performance</option>
          <option value="maintenance">Maintenance</option>
          <option value="weather">Weather</option>
          <option value="grid">Grid</option>
          <option value="forecast">Forecast</option>
        </select>
        <select className="filter-select" value={sevFilter} onChange={e => setSevFilter(e.target.value)}>
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="warning">Warning</option>
          <option value="info">Info</option>
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
          <input type="checkbox" checked={showResolved} onChange={e => setShowResolved(e.target.checked)} />
          Show resolved
        </label>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>{filtered.length} alerts shown</span>
      </div>

      {/* ─── Alert Cards ─────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(alert => (
          <div key={alert.id} className="card" style={{
            borderLeft: `4px solid var(--${alert.severity === 'critical' ? 'critical' : alert.severity === 'high' ? 'high' : alert.severity === 'warning' ? 'medium' : 'accent-blue'})`,
            opacity: alert.resolved ? 0.6 : 1,
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 4 }}>
                  <span className={`badge badge-${alert.severity}`}>{alert.severity.toUpperCase()}</span>
                  <span className="tag">{alert.category}</span>
                  {alert.assetName && <span className="tag">{alert.assetName}</span>}
                  {alert.acknowledged && <span className="badge badge-online" style={{ fontSize: 10 }}>ACK</span>}
                  {alert.resolved && <span className="badge badge-low" style={{ fontSize: 10 }}>RESOLVED</span>}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{alert.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{new Date(alert.timestamp).toLocaleString()}</div>
              </div>
            </div>

            {/* Problem */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Problem</div>
              <div style={{ fontSize: 13 }}>{alert.problem}</div>
            </div>

            {/* AI Explanation */}
            <div style={{ background: 'rgba(88,166,255,.06)', border: '1px solid rgba(88,166,255,.15)', borderRadius: 6, padding: '10px 12px', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: 'var(--accent-blue)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>🤖 AI Explanation</div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>{alert.aiExplanation}</div>
            </div>

            {/* Recommended Action */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recommended Action</div>
              <div style={{ fontSize: 13, color: 'var(--accent)', fontWeight: 500 }}>{alert.recommendedAction}</div>
            </div>

            {/* Actions */}
            {!alert.resolved && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {!alert.acknowledged && (
                  <button className="btn btn-secondary btn-sm" onClick={() => acknowledge(alert.id)}>✓ Acknowledge</button>
                )}
                <button className="btn btn-secondary btn-sm" style={{ color: 'var(--accent)' }} onClick={() => resolve(alert.id)}>✅ Mark Resolved</button>
                {alert.assetId && (
                  <button className="btn btn-secondary btn-sm" onClick={() => nav(`/assets/${alert.assetId}`)}>📡 View Asset</button>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="empty-state">
            <div style={{ fontSize: 32 }}>✅</div>
            <div>No alerts match the current filters</div>
          </div>
        )}
      </div>
    </div>
  );
}
