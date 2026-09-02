import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { generateWeatherData, currentWeather } from '../data/demoData';
import { format } from 'date-fns';

const statCard = (label: string, value: string | number, unit: string, icon: string, color: string, sub?: string) => (
  <div className="card card-sm" style={{ borderTop: `2px solid ${color}` }}>
    <div style={{ fontSize: 16, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 700, color }}>{value}<span style={{ fontSize: 13, fontWeight: 400, color: 'var(--text-muted)', marginLeft: 3 }}>{unit}</span></div>
    {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
  </div>
);

export default function WeatherIntelligence() {
  const [weatherHistory, setWeatherHistory] = useState<any[]>([]);

  useEffect(() => {
    const data = generateWeatherData(24).slice(-24).map(d => ({
      time: format(new Date(d.timestamp), 'HH:mm'),
      Temp: parseFloat(d.temperature.toFixed(1)),
      Wind: parseFloat(d.windSpeed.toFixed(1)),
      Irradiance: parseFloat(d.solarIrradiance.toFixed(0)),
      Cloud: d.cloudCover,
    }));
    setWeatherHistory(data);
  }, []);

  const w = currentWeather;

  return (
    <div>
      <div className="page-header">
        <h1>🌤 Weather Intelligence</h1>
        <div className="page-subtitle">
          Kutch &amp; Banaskantha, Gujarat · Real-time conditions &amp; forecast impact
          &nbsp;·&nbsp;<span style={{ color: 'var(--text-subtle)', fontSize: 11 }}>Prototype simulated weather data</span>
        </div>
      </div>

      {/* ─── Current Conditions ─────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div className="section-title">Current Conditions — Kutch Region</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {statCard('Temperature', w.temperature.toFixed(1), '°C', '🌡️', 'var(--accent-orange)', `Feels like ${w.feelsLike.toFixed(1)}°C`)}
          {statCard('Wind Speed', w.windSpeed.toFixed(1), 'm/s', '🌬️', 'var(--wind)', `Direction: ${w.windDirection}`)}
          {statCard('Solar Irradiance', w.solarIrradiance, 'W/m²', '☀️', 'var(--solar)', 'Global horizontal')}
          {statCard('Cloud Cover', w.cloudCover, '%', '☁️', 'var(--text-muted)', 'Sky coverage')}
          {statCard('Humidity', w.humidity, '%', '💧', 'var(--accent-blue)', 'Relative humidity')}
          {statCard('Rain Probability', w.rainProbability, '%', '🌧️', 'var(--accent-blue)', 'Next 6 hours')}
        </div>
      </div>

      {/* ─── Weather Charts ──────────────────────────────────── */}
      <div className="grid-2 mb-16">
        <div className="card">
          <h3 className="mb-12">Solar Irradiance — Last 24 Hours</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weatherHistory} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
              <Bar dataKey="Irradiance" fill="rgba(245,158,11,0.7)" name="W/m²" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="card">
          <h3 className="mb-12">Wind Speed & Temperature — Last 24 Hours</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weatherHistory} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={4} />
              <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} />
              <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="Wind" stroke="var(--wind)" dot={false} name="Wind m/s" />
              <Line type="monotone" dataKey="Temp" stroke="var(--accent-orange)" dot={false} name="Temp °C" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ─── Cloud Cover Chart ───────────────────────────────── */}
      <div className="card mb-16">
        <h3 className="mb-12">Cloud Cover — Last 24 Hours</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weatherHistory} margin={{ top: 4, right: 10, bottom: 0, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} interval={3} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} unit="%" domain={[0, 100]} />
            <Tooltip contentStyle={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12 }} />
            <Bar dataKey="Cloud" fill="rgba(88,166,255,0.5)" name="Cloud Cover %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ─── AI Impact Panel ─────────────────────────────────── */}
      <div className="ai-card">
        <div className="ai-card-title">🌤 WEATHER IMPACT ON RENEWABLE GENERATION — AI ANALYSIS</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 16 }}>
          <div style={{ background: 'rgba(245,158,11,.06)', border: '1px solid rgba(245,158,11,.2)', borderRadius: 6, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--solar)', marginBottom: 8 }}>☀️ SOLAR IMPACT</div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              Current irradiance: <strong>{w.solarIrradiance} W/m²</strong> — strong generation conditions.
              Cloud coverage is expected to increase significantly after <strong>14:00</strong>.
            </p>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(227,179,65,.1)', borderRadius: 4, fontSize: 12 }}>
              ⚠️ Cloud coverage increasing from 18% → 64% between 14:00–17:00.
              Expected solar output reduction: <strong style={{ color: 'var(--medium)' }}>11–16%</strong>.
            </div>
          </div>
          <div style={{ background: 'rgba(56,189,248,.06)', border: '1px solid rgba(56,189,248,.2)', borderRadius: 6, padding: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--wind)', marginBottom: 8 }}>🌬️ WIND IMPACT</div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>
              Current wind speed: <strong>{w.windSpeed} m/s</strong> from {w.windDirection}.
              Conditions are favorable for the Kutch wind corridor.
            </p>
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'rgba(56,189,248,.08)', borderRadius: 4, fontSize: 12 }}>
              🌬️ Increasing wind speed from northern direction may increase generation from the Banaskantha turbine cluster by <strong style={{ color: 'var(--accent)' }}>~8–12%</strong> by evening.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { label: 'Morning Generation', text: 'Clear sky — optimal solar output expected. Solar contributing ~93% of total generation.', color: 'var(--accent)', icon: '✅' },
            { label: 'Afternoon (14:00–17:00)', text: 'Cloud cover reducing solar by 11–16%. Wind offsetting ~6 MW. Net generation reduction: ~9%.', color: 'var(--medium)', icon: '⚠️' },
            { label: 'Evening', text: 'Solar declining naturally. Wind generation steady. Storage discharge recommended for demand support.', color: 'var(--accent-blue)', icon: '🔋' },
          ].map(item => (
            <div key={item.label} style={{ padding: '10px 12px', background: 'var(--surface2)', borderRadius: 6, border: '1px solid var(--border)' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: item.color, marginBottom: 4 }}>{item.icon} {item.label}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{item.text}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 10, color: 'var(--text-subtle)', marginTop: 12 }}>Prototype weather data — simulated for demonstration · Not actual meteorological measurements</div>
      </div>
    </div>
  );
}
