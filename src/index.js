export default {
  async fetch(request, env, ctx) {
    if (request.method !== "POST" && request.method !== "GET") {
      return new Response("Method Not Allowed", { status: 405 });
    }

    const auth = request.headers.get("Authorization");
    if (!auth || auth !== `Bearer ${env.GEMINI_PROXY_KEY}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build target URL for hard constraint
    const incomingUrl = new URL(request.url);
    const targetUrl = `https://generativelanguage.googleapis.com${incomingUrl.pathname}${incomingUrl.search}`;

    const newHeaders = new Headers(request.headers);
    newHeaders.delete("Host"); // let fetch set the correct host
    newHeaders.delete("Authorization"); // never forward your proxy token

    const proxyRequest = new Request(targetUrl, {
      method: request.method,
      headers: newHeaders,
      body: request.method === "POST" ? request.body : null,
      redirect: 'follow',
    });

    try {
      return fetch(proxyRequest);
    } catch (e) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500 });
    }
  },
};