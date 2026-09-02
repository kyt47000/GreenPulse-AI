import axios from 'axios';

const IBM_API_KEY = process.env.IBM_API_KEY;
const IBM_PROJECT_ID = process.env.IBM_PROJECT_ID;
const IBM_URL = process.env.IBM_URL || 'https://us-south.ml.cloud.ibm.com';

let cachedToken: string | null = null;
let tokenExpiry = 0;

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
  try {
    const token = await getIBMToken();
    const res = await axios.post(
      `${IBM_URL}/ml/v1/text/generation?version=2023-05-29`,
      {
        model_id: 'ibm/granite-13b-instruct-v2',
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
    return res.data.results[0].generated_text.trim();
  } catch (err: any) {
    console.error('[IBM Granite] Error:', err.message);
    return null as any;
  }
}
