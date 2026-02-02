curl -X GET "https://gemini-proxy.axpzhang.workers.dev/v1beta/models?key=xxxx" -H "Authorization: Bearer xxxx"


curl -X POST "https://gemini-proxy.axpzhang.workers.dev/v1beta/models/gemini-2.5-flash:generateContent" \
  -H "Authorization: Bearer xxxx" \
  -H "Content-Type: application/json" \
  -H "x-goog-api-key: xxxx" \
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "用一句话解释什么是 Cloudflare Worker" }
        ]
      }
    ]
  }'

curl -X GET "https://gemini-proxy.axpz.org/v1beta/models?key=xxxx" -H "Authorization: Bearer xxxx"


export PROXY_URL=wss://gemini-proxy.axpz.org
export GEMINI_PROXY_KEY=gpk_xxx
export GOOGLE_API_KEY=AIxxx

ffmpeg -f s16le -ar 24000 -ac 1 -i scripts/output.pcm scripts/output.wav
afplay scripts/output.wav