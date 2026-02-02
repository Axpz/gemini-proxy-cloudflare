export default {
  async fetch(request, env) {

    const auth = request.headers.get("Authorization");
    if (auth !== `Bearer ${env.GEMINI_PROXY_KEY}`) {
      return new Response("Unauthorized", { status: 401 });
    }

    const incomingUrl = new URL(request.url);
    const targetUrl = `https://generativelanguage.googleapis.com${incomingUrl.pathname}${incomingUrl.search}`;

    const headers = new Headers(request.headers);
    headers.delete("Host");
    headers.delete("Authorization");

    // HTTP + WS proxy
    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
      redirect: "follow",
    });

    try {
      return fetch(proxyRequest);
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  },
};