// ─── useLiveStream ────────────────────────────────────────────────────────────
// Connects to GET /api/stream (SSE) and keeps local state in sync with the
// backend simulator (or IBM Cloud Kafka consumer in live mode).
//
// Usage:
//   const { assets, alerts, weather, grid, connected, dataSource } = useLiveStream();
//
// The hook falls back to demoData immediately so the UI is never empty, then
// overlays live updates as soon as the SSE connection delivers a "snapshot".
//
// Environment:
//   VITE_API_URL  — if set, SSE connects to that base URL; otherwise /api (dev proxy)

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Asset, Alert, WeatherData, GridRecord } from '../types';
import {
  assets as demoAssets,
  alerts as demoAlerts,
  currentWeather as demoWeather,
} from '../data/demoData';

// ── Types mirroring the backend LiveState snapshot ───────────────────────────

export interface LiveStreamState {
  assets: Asset[];
  alerts: Alert[];
  weather: WeatherData | null;
  grid: GridRecord | null;
  /** 'simulator' | 'ibm-live' — forwarded from the backend snapshot event */
  dataSource: string;
  /** true once the first SSE event has arrived */
  connected: boolean;
  /** ISO timestamp of the most recent tick */
  lastUpdated: string | null;
  /** Total ticks received since mount */
  tickCount: number;
}

const INITIAL_STATE: LiveStreamState = {
  assets:      demoAssets as Asset[],
  alerts:      demoAlerts as Alert[],
  weather:     demoWeather as WeatherData,
  grid:        null,
  dataSource:  'simulator',
  connected:   false,
  lastUpdated: null,
  tickCount:   0,
};

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useLiveStream(): LiveStreamState {
  const [state, setState] = useState<LiveStreamState>(INITIAL_STATE);
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
    // Determine stream URL — respects Vite proxy in dev and VITE_API_URL in prod
    const base = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
    const url = `${base}/stream`;

    const es = new EventSource(url);
    esRef.current = es;

    // ── Snapshot: full state on first connect ──────────────────────────────
    es.addEventListener('snapshot', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setState(prev => ({
          ...prev,
          assets:      data.assets      ?? prev.assets,
          alerts:      data.alerts      ?? prev.alerts,
          weather:     data.weather     ?? prev.weather,
          grid:        data.grid        ?? prev.grid,
          dataSource:  data.dataSource  ?? prev.dataSource,
          connected:   true,
          lastUpdated: new Date().toISOString(),
        }));
      } catch {
        // malformed JSON — keep previous state
      }
    });

    // ── Tick: incremental state updates every 3 s ─────────────────────────
    es.addEventListener('tick', (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data);
        setState(prev => ({
          ...prev,
          assets:      data.assets      ?? prev.assets,
          alerts:      data.alerts      ?? prev.alerts,
          weather:     data.weather     ?? prev.weather,
          grid:        data.grid        ?? prev.grid,
          connected:   true,
          lastUpdated: new Date().toISOString(),
          tickCount:   prev.tickCount + 1,
        }));
      } catch {
        // malformed JSON — keep previous state
      }
    });

    // ── Error: retry with exponential back-off (max 30 s) ─────────────────
    es.onerror = () => {
      es.close();
      esRef.current = null;
      setState(prev => ({ ...prev, connected: false }));
      const delay = Math.min(30_000, 2_000 * (state.tickCount === 0 ? 1 : 2));
      retryRef.current = setTimeout(connect, delay);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    connect();
    return () => {
      esRef.current?.close();
      if (retryRef.current) clearTimeout(retryRef.current);
    };
  }, [connect]);

  return state;
}

export default useLiveStream;
