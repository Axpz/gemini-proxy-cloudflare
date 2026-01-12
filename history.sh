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

