import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/command-center', label: 'Command Center', icon: '⚡' },
  { path: '/assets', label: 'Asset Monitoring', icon: '📡' },
  { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
  { path: '/forecast', label: 'Generation Forecast', icon: '📈' },
  { path: '/weather', label: 'Weather Intelligence', icon: '🌤' },
  { path: '/grid', label: 'Grid Optimization', icon: '🔌' },
  { path: '/copilot', label: 'AI Copilot', icon: '🤖' },
  { path: '/agents', label: 'Agent Activity', icon: '🧠' },
  { path: '/alerts', label: 'Alert Center', icon: '🔔', badge: 3 },
  { path: '/map', label: 'Regional Map', icon: '🗺' },
  { path: '/architecture', label: 'Architecture', icon: '🏗' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside style={{
      width: collapsed ? 56 : 240,
      minHeight: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.2s',
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '16px 12px' : '16px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
      }} onClick={() => setCollapsed(!collapsed)}>
        <span style={{ fontSize: 20, flexShrink: 0 }}>🌿</span>
        {!collapsed && (
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--accent)', letterSpacing: '-0.3px' }}>GreenPulse AI</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Energy Intelligence</div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 0', overflowY: 'auto' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: collapsed ? '9px 16px' : '9px 20px',
              textDecoration: 'none',
              fontSize: 13,
              fontWeight: 500,
              color: isActive ? 'var(--text)' : 'var(--text-muted)',
              background: isActive ? 'var(--surface2)' : 'transparent',
              borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              transition: 'all 0.1s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            })}
          >
            <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
            {!collapsed && (
              <>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span style={{
                    background: 'var(--critical)', color: '#fff',
                    borderRadius: 10, fontSize: 10, padding: '1px 5px', fontWeight: 600,
                  }}>{item.badge}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 10, color: 'var(--text-subtle)', lineHeight: 1.5 }}>
            <div style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: 11 }}>IBM Granite LLM</div>
            <div>Prototype · Demo Data</div>
            <div style={{ marginTop: 4 }}>Kutch &amp; Banaskantha, Gujarat</div>
          </div>
        </div>
      )}
    </aside>
  );
}
