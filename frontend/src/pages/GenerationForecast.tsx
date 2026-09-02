import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { generateForecast, generateHistoricalGeneration } from '../data/demoData';
import { format } from 'date-fns';

export default function GenerationForecast() {
  const [forecastData, setForecastData] = useState<any[]>([]);
  const [histData, setHistData] = useState<any[]>([]);
  const [range, setRange] = useState<6 | 24 | 72>(24);
  const [view, setView] = useState<'combined' | 'solar' | 'wind'>('combined');

  useEffect(() => {
    const forecast = generateForecast(72);
    const sliced = forecast.slice(0, range + 1);
    setForecastData(sliced.map(d => ({
      time: format(new Date(d.timestamp), range === 6 ? 'HH:mm' : 'MM/dd HH:mm'),
      Solar: d.solarMW,
      Wind: d.windMW,
      Total: d.totalMW,
      Low: d.confidenceLow,
      High: d.confidenceHigh,
    })));

    const hist = generateHistoricalGeneration(2).slice(-24).map(d => ({
      time: format(new Date(d.timestamp), 'HH:mm'),
      Actual: d.totalMW,
      Expected: d.expectedMW,
    }));
    setHistData(hist);
  }, [range]);

  const latest = forecastData[0];
  const peak = forecastData.reduce((max, d) => d.Total > (max?.Total || 0) ? d : max, {} as any);
  const avg = forecastData.reduce((s, d) => s + d.Total, 0) / (forecastData.length || 1);
  const dailyMWh = avg * 24;

  return (
    <div>
      <div className="page-header">
        <h1>📈 Generation Forecast</h1>
        <div className="page-subtitle">
          AI-powered solar &amp; wind generation prediction · Weather-integrated · <span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype demo data</span>
        </div>
      </div>

      {/* ─── Forecast summary cards ─────────────────────────── */}
      <div className="kpi-grid mb-16">
        <div className="kpi-card">
          <div className="kpi-label">Next 6-Hour Total</div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>
            {(forecastData.slice(0, 6).reduce((s, d) => s + d.Total, 0)).toFixed(0)} MWh
          </div>
          <div className="kpi-sub">Solar + Wind combined</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">24-Hour Total</div>
          <div className="kpi-value" style={{ color: 'var(--accent)' }}>
            {(forecastData.slice(0, 24).reduce((s, d) => s + d.Total, 0)).toFixed(0)} MWh
          </div>
          <div className="kpi-sub">Daily forecast</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Peak Generation</div>
          <div className="kpi-value" style={{ color: 'var(--solar)' }}>{peak.Total?.toFixed(0) || '—'} MW</div>
          <div className="kpi-sub">{peak.time || '—'}</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Current Solar</div>
          <div className="kpi-value" style={{ color: 'var(--solar)' }}>{latest?.Solar?.toFixed(0) || '—'} MW</div>
          <div className="kpi-sub">Forecast now</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Current Wind</div>
          <div className="kpi-value" style={{ color: 'var(--wind)' }}>{latest?.Wind?.toFixed(0) || '—'} MW</div>
          <div className="kpi-sub">Forecast now</div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">7-Day Total</div>
          <div className="kpi-value">{(dailyMWh * 7 / 1000).toFixed(1)} GWh</div>
          <div className="kpi-sub">Weekly estimate</div>
        </div>
      </div>

      {/* ─── Forecast chart ─────────────────────────────────── */}
      <div className="card mb-16">
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h3>Generation Forecast</h3>
            <div style={{ display: 'flex', gap: 6 }}>
              {(['combined', 'solar', 'wind'] as const).map(v => (
                <button key={v} className={`btn btn-sm ${view === v ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setView(v)}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {([6, 24, 72] as const).map(r => (
              <button key={r} className={`btn btn-sm ${range === r ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setRange(r)}>
                {r === 6 ? '6h' : r === 24 ? '24h' : '7d'}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={forecastData} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={Math.floor(forecastData.length / 8)} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} unit=" MW" />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {(view === 'combined' || view === 'solar') && (
              <Area type="monotone" dataKey="Solar" stroke="var(--solar)" fill="rgba(245,158,11,0.2)" name="Solar MW" />
            )}
            {(view === 'combined' || view === 'wind') && (
              <Area type="monotone" dataKey="Wind" stroke="var(--wind)" fill="rgba(56,189,248,0.2)" name="Wind MW" />
            )}
            {view === 'combined' && (
              <Area type="monotone" dataKey="High" stroke="transparent" fill="rgba(63,185,80,0.07)" name="Confidence Range" strokeDasharray="3 2" />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── Actual vs Predicted (last 24h) ─────────────────── */}
      <div className="card mb-16">
        <div className="card-header">
          <h3>Actual vs Predicted — Last 24 Hours</h3>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>MW · Prototype data</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={histData} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={4} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area type="monotone" dataKey="Expected" stroke="var(--text-subtle)" fill="transparent" strokeDasharray="4 2" name="Predicted" />
            <Area type="monotone" dataKey="Actual" stroke="var(--accent)" fill="rgba(63,185,80,0.15)" name="Actual" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ─── AI Weather Impact Panel ─────────────────────────── */}
      <div className="ai-card">
        <div className="ai-card-title">🌤 WEATHER IMPACT ON GENERATION — AI FORECAST</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--solar)', marginBottom: 8 }}>☀️ Solar Impact</div>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
              Solar generation forecast peaks at <strong>~485 MW</strong> around <strong>12:30</strong> today.
              Cloud cover is expected to increase significantly after <strong>14:00</strong>, reducing solar irradiance from 820 W/m² to ~340 W/m².
              <br /><br />
              Expected reduction: <strong style={{ color: 'var(--medium)' }}>11–16% between 14:00–17:00</strong>.
            </p>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--wind)', marginBottom: 8 }}>🌬️ Wind Impact</div>
            <p style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.6 }}>
              Northwest wind speed at <strong>8.4 m/s</strong> — conditions support <strong>28–32 MW</strong> output from wind assets.
              Wind speed forecast to remain stable through the evening, partially offsetting solar generation decline.
              <br /><br />
              <span style={{ color: 'var(--accent)' }}>Wind offsetting solar drop by ~6 MW.</span>
            </p>
          </div>
        </div>
        <div style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(63,185,80,.06)', borderRadius: 6, border: '1px solid rgba(63,185,80,.15)' }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', marginBottom: 4 }}>📊 DAILY SUMMARY</div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Total daily generation forecast: <strong style={{ color: 'var(--text)' }}>~4,280 MWh</strong> (vs 4,340 MWh yesterday — 1.4% reduction due to afternoon clouds).
            Curtailment risk at peak solar hours: <strong style={{ color: 'var(--medium)' }}>moderate</strong> — pre-charging storage recommended by 11:00.
          </p>
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 10 }}>Prototype estimate — simulated weather data · Not actual meteorological measurements</div>
      </div>
    </div>
  );
}
