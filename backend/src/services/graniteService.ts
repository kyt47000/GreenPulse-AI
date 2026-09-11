import axios from 'axios';

const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_PROJECT_ID = process.env.IBM_PROJECT_ID;
const IBM_URL = process.env.IBM_URL || 'https://us-south.ml.cloud.ibm.com';

let cachedToken: string | null = null;
let tokenExpiry = 0;

// ── Rate-limit guard ──────────────────────────────────────────────────────────
// Lite plan allows ~2 requests/minute. We enforce a minimum gap between calls.
let lastCallAt = 0;
const MIN_GAP_MS = 10_000; // 10 s between Granite calls — safe for Lite plan

// ── Response cache ────────────────────────────────────────────────────────────
// Cache last response per normalised prompt key for 60 s.
// Avoids burning quota on identical repeated questions.
const responseCache = new Map<string, { text: string; ts: number }>();
const CACHE_TTL_MS = 60_000;

async function getIBMToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;
  const res = await axios.post(
    'https://iam.cloud.ibm.com/identity/token',
    new URLSearchParams({ grant_type: 'urn:ibm:params:oauth:grant-type:apikey', apikey: IBM_API_KEY! }),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
  cachedToken = res.data.access_token;
  tokenExpiry = Date.now() + (res.data.expires_in - 60) * 1000;
  return cachedToken!;
}

export async function queryGranite(systemPrompt: string, userMessage: string): Promise<string> {
  if (!IBM_API_KEY || !IBM_PROJECT_ID) {
    return null as any; // signals mock fallback
  }

  // Cache lookup
  const cacheKey = userMessage.trim().toLowerCase().slice(0, 120);
  const cached = responseCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
    console.log('[IBM Granite] Cache hit — skipping API call');
    return cached.text;
  }

  // Rate-limit guard
  const now = Date.now();
  const gap = now - lastCallAt;
  if (gap < MIN_GAP_MS) {
    const wait = MIN_GAP_MS - gap;
    console.log(`[IBM Granite] Rate-limit guard — waiting ${wait}ms`);
    await new Promise(r => setTimeout(r, wait));
  }
  lastCallAt = Date.now();

  try {
    const token = await getIBMToken();
    const res = await axios.post(
      `${IBM_URL}/ml/v1/text/generation?version=2024-05-31`,
      {
        model_id: 'ibm/granite-4-h-small',
        input: `<|system|>\n${systemPrompt}\n<|user|>\n${userMessage}\n<|assistant|>\n`,
        parameters: {
          decoding_method: 'greedy',
          max_new_tokens: 512,
          stop_sequences: ['<|user|>'],
          repetition_penalty: 1.1,
        },
        project_id: IBM_PROJECT_ID,
      },
      { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } }
    );
    const text = res.data.results[0].generated_text.trim();
    // Store in cache
    responseCache.set(cacheKey, { text, ts: Date.now() });
    return text;
  } catch (err: any) {
    console.error('[IBM Granite] Error:', err.message);
    return null as any;
  }
}
