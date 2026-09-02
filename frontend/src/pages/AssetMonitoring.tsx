import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../data/demoData';
import type { Asset } from '../types';

export default function AssetMonitoring() {
  const nav = useNavigate();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');

  const filtered = assets.filter(a => {
    if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.assetId.toLowerCase().includes(search.toLowerCase())) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    if (regionFilter !== 'all' && a.region !== regionFilter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (riskFilter !== 'all' && a.riskLevel !== riskFilter) return false;
    return true;
  });

  const regions = [...new Set(assets.map(a => a.region))];

  function HealthBar({ score }: { score: number }) {
    const color = score >= 80 ? 'var(--accent)' : score >= 60 ? 'var(--medium)' : 'var(--critical)';
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div className="progress-bar" style={{ width: 60 }}>
          <div className="progress-fill" style={{ width: `${score}%`, background: color }} />
        </div>
        <span style={{ fontSize: 11, color, fontWeight: 600 }}>{score}%</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>📡 Live Asset Monitoring</h1>
        <div className="page-subtitle">
          {assets.length} assets · {assets.filter(a => a.status === 'online').length} online · {assets.filter(a => a.status === 'warning').length} warning · {assets.filter(a => a.status === 'maintenance').length} offline
          &nbsp;·&nbsp;<span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype demo data</span>
        </div>
      </div>

      {/* ─── Summary badges ──────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { label: `${assets.filter(a => a.type === 'solar').length} Solar`, class: 'badge-solar' },
          { label: `${assets.filter(a => a.type === 'wind').length} Wind`, class: 'badge-wind' },
          { label: `${assets.filter(a => a.type === 'hybrid').length} Hybrid`, class: 'badge-hybrid' },
          { label: `${assets.filter(a => a.riskLevel === 'CRITICAL').length} Critical`, class: 'badge-critical' },
          { label: `${assets.filter(a => a.riskLevel === 'HIGH').length} High Risk`, class: 'badge-high' },
          { label: `${assets.filter(a => a.riskLevel === 'MEDIUM').length} Medium Risk`, class: 'badge-medium' },
        ].map(b => <span key={b.label} className={`badge ${b.class}`}>{b.label}</span>)}
      </div>

      {/* ─── Filters ─────────────────────────────────────────── */}
      <div className="filter-bar">
        <input className="search-input" placeholder="Search by name or ID..." value={search} onChange={e => setSearch(e.target.value)} />
        <select className="filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="solar">Solar</option>
          <option value="wind">Wind</option>
          <option value="hybrid">Hybrid</option>
        </select>
        <select className="filter-select" value={regionFilter} onChange={e => setRegionFilter(e.target.value)}>
          <option value="all">All Regions</option>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="online">Online</option>
          <option value="warning">Warning</option>
          <option value="maintenance">Maintenance</option>
          <option value="offline">Offline</option>
        </select>
        <select className="filter-select" value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
          <option value="all">All Risk</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="CRITICAL">Critical</option>
        </select>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 'auto' }}>{filtered.length} assets shown</span>
      </div>

      {/* ─── Table ───────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0 }}>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Asset ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Region</th>
                <th>Capacity</th>
                <th>Current Output</th>
                <th>Expected</th>
                <th>Efficiency</th>
                <th>Health Score</th>
                <th>Status</th>
                <th>Risk Level</th>
                <th>Temp (°C)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset: Asset) => (
                <tr key={asset.assetId} className="clickable" onClick={() => nav(`/assets/${asset.assetId}`)}>
                  <td className="font-mono" style={{ fontWeight: 600 }}>{asset.assetId}</td>
                  <td style={{ maxWidth: 180 }}>
                    <div style={{ fontWeight: 500, fontSize: 13 }}>{asset.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{asset.region}</div>
                  </td>
                  <td><span className={`badge badge-${asset.type}`}>{asset.type}</span></td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>{asset.region}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.capacityMW} MW</td>
                  <td style={{ fontWeight: 700 }}>{asset.currentOutputMW.toFixed(1)} MW</td>
                  <td style={{ color: 'var(--text-muted)' }}>{asset.expectedOutputMW.toFixed(1)} MW</td>
                  <td>
                    <span style={{ color: asset.efficiency >= 95 ? 'var(--accent)' : asset.efficiency >= 85 ? 'var(--medium)' : 'var(--critical)', fontWeight: 600 }}>
                      {asset.efficiency.toFixed(1)}%
                    </span>
                  </td>
                  <td><HealthBar score={asset.healthScore} /></td>
                  <td><span className={`badge badge-${asset.status}`}>{asset.status}</span></td>
                  <td><span className={`badge badge-${asset.riskLevel.toLowerCase()}`}>{asset.riskLevel}</span></td>
                  <td style={{ color: asset.temperature > 42 ? 'var(--medium)' : 'var(--text-muted)', fontWeight: asset.temperature > 42 ? 600 : 400 }}>
                    {asset.temperature.toFixed(1)}°C
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── Cards view for quick overview ───────────────────── */}
      <div style={{ marginTop: 24 }}>
        <h3 className="mb-12">🔴 Assets Requiring Attention</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {assets.filter(a => a.riskLevel === 'HIGH' || a.riskLevel === 'CRITICAL' || a.status === 'warning').map(asset => (
            <div key={asset.assetId} className="card card-sm clickable" style={{ borderLeft: `3px solid var(--${asset.riskLevel === 'CRITICAL' ? 'critical' : asset.riskLevel === 'HIGH' ? 'high' : 'medium'})` }} onClick={() => nav(`/assets/${asset.assetId}`)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{asset.assetId} — {asset.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{asset.type} · {asset.region}</div>
                </div>
                <span className={`badge badge-${asset.riskLevel.toLowerCase()}`}>{asset.riskLevel}</span>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Output</div>
                  <div style={{ fontWeight: 600 }}>{asset.currentOutputMW.toFixed(1)} / {asset.expectedOutputMW.toFixed(1)} MW</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Health</div>
                  <div style={{ fontWeight: 600, color: asset.healthScore >= 80 ? 'var(--accent)' : asset.healthScore >= 60 ? 'var(--medium)' : 'var(--critical)' }}>{asset.healthScore}%</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)' }}>Vibration</div>
                  <div style={{ fontWeight: 600, color: asset.vibration > 0.65 ? 'var(--critical)' : 'var(--text-muted)' }}>{asset.vibration.toFixed(2)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
