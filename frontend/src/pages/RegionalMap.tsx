import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { assets } from '../data/demoData';

// Representative schematic positions for Gujarat map
const assetPositions: Record<string, { x: number; y: number }> = {
  // Kutch (west Gujarat, lower on map since north is up)
  'SF-01': { x: 14, y: 54 },  // Bhuj area
  'SF-02': { x: 11, y: 72 },  // Mundra
  'SF-03': { x: 8, y: 46 },   // Nakhatrana
  'HY-01': { x: 16, y: 60 },  // Kutch hybrid
  'WT-01': { x: 6, y: 51 },
  'WT-02': { x: 6, y: 55 },
  'WT-03': { x: 7, y: 58 },
  'WT-04': { x: 14, y: 52 },  // Bhuj
  'WT-05': { x: 15, y: 56 },  // Bhuj
  // Banaskantha (north Gujarat, upper on map)
  'SF-04': { x: 60, y: 20 },  // Deesa
  'SF-05': { x: 65, y: 26 },  // Palanpur
  'HY-02': { x: 58, y: 30 },  // Banaskantha hybrid
  'WT-06': { x: 55, y: 22 },
  'WT-07': { x: 57, y: 25 },
  'WT-08': { x: 59, y: 27 },
  'WT-09': { x: 62, y: 22 },
};

const typeIcons: Record<string, string> = { solar: '☀️', wind: '🌬️', hybrid: '⚡' };
const statusColors: Record<string, string> = {
  online: '#3fb950',
  warning: '#e3b341',
  maintenance: '#f85149',
  offline: '#f85149',
};

export default function RegionalMap() {
  const nav = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  const selectedAsset = selected ? assets.find(a => a.assetId === selected) : null;

  return (
    <div>
      <div className="page-header">
        <h1>🗺 Regional Map</h1>
        <div className="page-subtitle">
          Schematic asset visualization · Kutch &amp; Banaskantha, Gujarat, India
          &nbsp;·&nbsp;<span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Representative positions — not GPS-precise · Prototype demo data</span>
        </div>
      </div>

      {/* ─── Legend ──────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        {[
          { color: '#3fb950', label: 'Online' },
          { color: '#e3b341', label: 'Warning' },
          { color: '#f85149', label: 'Critical / Offline' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
            {item.label}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 12, marginLeft: 'auto', fontSize: 12 }}>
          <span>☀️ Solar</span>
          <span>🌬️ Wind</span>
          <span>⚡ Hybrid</span>
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16, alignItems: 'start' }}>
        {/* ─── Map SVG ─────────────────────────────────────────── */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600 }}>Gujarat — Schematic Asset Map</div>
          <div style={{ position: 'relative', background: 'var(--surface2)', minHeight: 480 }}>
            <svg width="100%" viewBox="0 0 100 100" style={{ display: 'block' }}>
              {/* Gujarat schematic background */}
              {/* Kutch peninsula */}
              <polygon points="2,42 18,42 20,55 24,65 20,78 14,82 6,78 2,65" fill="#1c2128" stroke="#30363d" strokeWidth="0.3" />
              {/* Mainland Gujarat */}
              <polygon points="18,42 55,20 80,18 90,30 88,50 80,70 70,80 55,85 40,88 30,85 24,75 20,78 24,65 20,55 18,42" fill="#161b22" stroke="#30363d" strokeWidth="0.3" />

              {/* Region labels */}
              <text x="10" y="88" fontSize="3.5" fill="#484f58" textAnchor="middle">Kutch</text>
              <text x="62" y="15" fontSize="3.5" fill="#484f58" textAnchor="middle">Banaskantha</text>
              <text x="50" y="55" fontSize="3" fill="#484f58" textAnchor="middle">Gujarat</text>

              {/* City labels */}
              <text x="14" y="50" fontSize="2.5" fill="#57606a">Bhuj</text>
              <text x="9" y="72" fontSize="2.5" fill="#57606a">Mundra</text>
              <text x="58" y="34" fontSize="2.5" fill="#57606a">Deesa</text>
              <text x="64" y="28" fontSize="2.5" fill="#57606a">Palanpur</text>

              {/* Sea */}
              <text x="6" y="96" fontSize="3" fill="#21262d">Arabian Sea</text>

              {/* Asset markers */}
              {assets.map(asset => {
                const pos = assetPositions[asset.assetId];
                if (!pos) return null;
                const color = statusColors[asset.status] || '#3fb950';
                const isSelected = selected === asset.assetId;
                return (
                  <g key={asset.assetId} onClick={() => setSelected(isSelected ? null : asset.assetId)} style={{ cursor: 'pointer' }}>
                    {isSelected && <circle cx={pos.x} cy={pos.y} r={3.5} fill={color} opacity={0.2} />}
                    <circle
                      cx={pos.x} cy={pos.y} r={isSelected ? 2.2 : 1.8}
                      fill={color}
                      stroke={isSelected ? '#fff' : color}
                      strokeWidth={isSelected ? 0.4 : 0.2}
                      opacity={0.9}
                    />
                    {isSelected && (
                      <text x={pos.x + 2.5} y={pos.y + 1} fontSize="2.2" fill="#e6edf3">{asset.assetId}</text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Hover instructions */}
            {!selected && (
              <div style={{ position: 'absolute', bottom: 12, left: 12, fontSize: 11, color: 'var(--text-subtle)', background: 'rgba(13,17,23,.8)', padding: '4px 8px', borderRadius: 4 }}>
                Click a marker to view asset info
              </div>
            )}
          </div>
        </div>

        {/* ─── Asset List + Detail ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {selectedAsset ? (
            <div className="card" style={{ borderTop: `2px solid ${statusColors[selectedAsset.status]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <h3>{selectedAsset.assetId} — {selectedAsset.name}</h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelected(null)}>✕</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                {[
                  { l: 'Type', v: selectedAsset.type },
                  { l: 'Region', v: selectedAsset.region },
                  { l: 'Capacity', v: `${selectedAsset.capacityMW} MW` },
                  { l: 'Output', v: `${selectedAsset.currentOutputMW.toFixed(1)} MW` },
                  { l: 'Efficiency', v: `${selectedAsset.efficiency.toFixed(1)}%` },
                  { l: 'Health', v: `${selectedAsset.healthScore}%` },
                ].map(item => (
                  <div key={item.l}>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{item.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{item.v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <span className={`badge badge-${selectedAsset.status}`}>{selectedAsset.status}</span>
                <span className={`badge badge-${selectedAsset.riskLevel.toLowerCase()}`}>{selectedAsset.riskLevel}</span>
              </div>
              <div style={{ marginTop: 12 }}>
                <button className="btn btn-primary btn-sm" onClick={() => nav(`/assets/${selectedAsset.assetId}`)}>View Full Detail →</button>
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                Select a marker on the map to view asset details
              </div>
            </div>
          )}

          {/* Asset cluster list */}
          {[{ region: 'Kutch', icon: '🏭' }, { region: 'Banaskantha', icon: '🌾' }].map(({ region, icon }) => (
            <div key={region} className="card">
              <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{icon} {region}</div>
              {assets.filter(a => a.region === region).map(a => (
                <div key={a.assetId} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 0', borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }} onClick={() => setSelected(a.assetId)}>
                  <span style={{ fontSize: 13 }}>{typeIcons[a.type]}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.assetId}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{a.currentOutputMW.toFixed(1)} / {a.capacityMW} MW</div>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: statusColors[a.status], flexShrink: 0 }} />
                  <span className={`badge badge-${a.riskLevel.toLowerCase()}`} style={{ fontSize: 10 }}>{a.riskLevel}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
