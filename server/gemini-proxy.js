import express from 'express';
import fetch from 'node-fetch';
const app = express();
app.use(express.json({ limit: '1mb' }));

// Simple proxy endpoint to call Gemini server-side using a secure key.
// Configure GEMINI_KEY in the server environment (never checked into git).
const GEMINI_KEY = process.env.GEMINI_KEY;
if (!GEMINI_KEY) {
  console.warn('GEMINI_KEY not set in server environment. Proxy will return 500 for requests.');
}

app.post('/api/gemini', async (req, res) => {
  try {
    if (!GEMINI_KEY) return res.status(500).json({ error: 'GEMINI_KEY not configured on server' });
    const { prompt, systemInstruction, generationConfig } = req.body;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
    const payload = {
      systemInstruction: { parts: [{ text: systemInstruction || '' }] },
      contents: [{ parts: [{ text: prompt || '' }] }],
      generationConfig: generationConfig || { temperature: 0.7, maxOutputTokens: 2048 }
    };
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await r.json();
    return res.json(data);
  } catch (err) {
    console.error('Proxy error', err);
    return res.status(500).json({ error: 'Proxy call failed', details: String(err) });
  }
});

if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT || 3001;
  app.listen(port, () => console.log(`Gemini proxy running on http://localhost:${port}/api/gemini`));
}

export default app;
