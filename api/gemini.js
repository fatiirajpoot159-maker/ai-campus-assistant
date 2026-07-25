import fetch from 'node-fetch';

const GEMINI_KEY = process.env.GEMINI_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'GEMINI_KEY not configured on server' });
  }

  try {
    const { prompt, systemInstruction, generationConfig } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const payload = {
      systemInstruction: { parts: [{ text: systemInstruction || '' }] },
      contents: [{ parts: [{ text: prompt || '' }] }],
      generationConfig: generationConfig || { temperature: 0.7, maxOutputTokens: 2048 }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error('Vercel proxy error', err);
    return res.status(500).json({ error: 'Proxy call failed', details: String(err) });
  }
}
