# Gemini Proxy Worker

Cloudflare Worker that proxies requests to the Google Generative Language (Gemini) API with a minimal, auth-first setup.

## Quick start

1) Install deps: `npm install` (uses Wrangler v3).  
2) Create `env.local` from `env.local` template and fill your keys.  
3) Start dev server: `npm run dev`.  
4) Deploy to Cloudflare: `npm run deploy` (or `npm run deploy:prod` for production).

## Configuration

- Secrets: set `GEMINI_PROXY_KEY` in Cloudflare (Dashboard → Worker → Variables) or run `wrangler secret put GEMINI_PROXY_KEY`.
- Requests must include `Authorization: Bearer <GEMINI_PROXY_KEY>`.
- The worker forwards only whitelisted headers; the proxy token is stripped before calling Google.

## Example requests

See `test-history.sh` for curl examples. Replace placeholders with your own keys.

## Notes

- Keep `env.local` out of version control (see `.gitignore`).
- Only `GET` and `POST` are accepted; anything else returns `405`.
- Keep the proxy lightweight—no extra logging or middleware to reduce latency.

