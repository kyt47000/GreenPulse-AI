// ─── IBM Live Source Stub ─────────────────────────────────────────────────────
// This module is the real-world replacement for the simulator.
// When DATA_SOURCE=ibm-live in .env, dataSourceAdapter imports this instead.
//
// To wire up real IBM Cloud services:
//   1. Install kafkajs:          npm install kafkajs
//   2. Install pg:               npm install pg @types/pg
//   3. Install node-fetch:       npm install node-fetch
//   4. Fill in the implementations below using credentials from .env
//   5. Set DATA_SOURCE=ibm-live in backend/.env
//   6. Delete backend/src/data/simulator/ (or keep it for local dev)
//
// The routes and SSE stream work identically — only the data source changes.

import { liveState } from '../simulator/liveAssetState';
import sseEmitter from '../simulator/sseEmitter';

// ── IBM Cloud Event Streams (Kafka) consumer ──────────────────────────────────
// Uncomment and fill in when Event Streams credentials are available.
//
// import { Kafka } from 'kafkajs';
//
// const kafka = new Kafka({
//   clientId: 'greenpulse-backend',
//   brokers: [process.env.EVENT_STREAMS_BROKER!],
//   ssl: true,
//   sasl: {
//     mechanism: 'plain',
//     username: 'token',
//     password: process.env.EVENT_STREAMS_API_KEY!,
//   },
// });
//
// const consumer = kafka.consumer({ groupId: 'greenpulse-agents' });
//
// async function startKafkaConsumer() {
//   await consumer.connect();
//   await consumer.subscribe({ topic: 'greenpulse.asset-telemetry', fromBeginning: false });
//   await consumer.run({
//     eachMessage: async ({ message }) => {
//       const telemetry = JSON.parse(message.value!.toString());
//       // Find the asset in liveState and update its fields
//       const asset = liveState.assets.find(a => a.assetId === telemetry.assetId);
//       if (asset) {
//         Object.assign(asset, telemetry, { lastUpdated: new Date().toISOString() });
//         sseEmitter.emit('tick', liveState);
//       }
//     },
//   });
// }

// ── Open-Meteo weather (free, no key needed) ───────────────────────────────────
// Replace the weather ticker in the simulator with this real API call.
//
// async function fetchRealWeather() {
//   const res = await fetch(
//     'https://api.open-meteo.com/v1/forecast?' +
//     'latitude=23.73&longitude=69.86' +
//     '&current_weather=true' +
//     '&hourly=shortwave_radiation,cloudcover,relativehumidity_2m,apparent_temperature'
//   );
//   const data = await res.json();
//   liveState.weather = {
//     timestamp:        new Date().toISOString(),
//     region:           'Kutch',
//     temperature:      data.current_weather.temperature,
//     windSpeed:        data.current_weather.windspeed,
//     windDirection:    String(data.current_weather.winddirection),
//     solarIrradiance:  data.hourly.shortwave_radiation[new Date().getHours()] ?? 0,
//     cloudCover:       data.hourly.cloudcover[new Date().getHours()] ?? 0,
//     humidity:         data.hourly.relativehumidity_2m[new Date().getHours()] ?? 50,
//     rainProbability:  0,
//     feelsLike:        data.hourly.apparent_temperature[new Date().getHours()] ?? data.current_weather.temperature,
//   };
// }

// ── IBM Cloud Databases for PostgreSQL time-series history ────────────────────
// Replaces generateHistoricalGeneration() with a real SQL query.
//
// import { Pool } from 'pg';
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false },
// });
//
// export async function getGenerationHistoryFromDB(hours: number) {
//   const { rows } = await pool.query(
//     `SELECT date_trunc('hour', recorded_at) AS timestamp,
//             SUM(CASE WHEN asset_type='solar' THEN output_mw ELSE 0 END) AS "solarMW",
//             SUM(CASE WHEN asset_type='wind'  THEN output_mw ELSE 0 END) AS "windMW",
//             SUM(output_mw)                                              AS "totalMW"
//      FROM   asset_telemetry
//      WHERE  recorded_at >= NOW() - ($1 || ' hours')::INTERVAL
//      GROUP  BY 1
//      ORDER  BY 1`,
//     [hours]
//   );
//   return rows;
// }

// ── Entry point called by dataSourceAdapter ────────────────────────────────────
export async function startIbmLiveSource(): Promise<void> {
  console.log('  ☁️  IBM Live Source: starting...');
  // await startKafkaConsumer();
  // setInterval(fetchRealWeather, 60_000); // refresh weather every minute
  console.log('  ⚠️  IBM Live Source: stubs only — uncomment implementations above');
  console.log('      See README → Going Live with IBM Cloud for full instructions');
}
