Serverless Gemini Proxy

This project includes a small server proxy at `server/gemini-proxy.js` you can deploy to keep your Gemini API key secret.

How it works
- The proxy exposes `POST /api/gemini` and forwards the prompt payload to the Google Generative Language API using `GEMINI_KEY` from the server environment.
- Your client can set `VITE_GEMINI_PROXY` to the proxy base URL (e.g. `https://my-proxy.example.com`) so the frontend sends prompts to the proxy instead of embedding the API key.

Run locally
1. Install dependencies (node 18+ recommended):

```bash
cd server
npm init -y
npm install express node-fetch
node gemini-proxy.js
```

2. Start the proxy with your server key:

```bash
GEMINI_KEY=YOUR_ACTUAL_KEY node gemini-proxy.js
```

Deploying
- Vercel: place `server/gemini-proxy.js` under an `api/` directory or wrap as a serverless function and set `GEMINI_KEY` in Vercel project env vars.
- Netlify: convert to Netlify Function signature or deploy the small Express app to a server (Heroku, Railway) and set `GEMINI_KEY`.

Client setup
- In your hosting environment, set `VITE_GEMINI_PROXY` to your deployed proxy URL (no trailing slash), or run the client locally and set `VITE_GEMINI_PROXY` in your `.env`.

Security note
- Do NOT commit `GEMINI_KEY` to source control. Use your host's secret manager or environment variable settings.
