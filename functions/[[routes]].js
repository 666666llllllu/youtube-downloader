export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 处理CORS预检请求
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    // API路由处理
    if (url.pathname.startsWith('/api/')) {
      const route = url.pathname.replace('/api/', '');
      
      switch (route) {
        case 'analyze':
          const { onRequest } = await import('./api/analyze');
          return onRequest({ request, env });
        default:
          return new Response('Not Found', { status: 404 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
} 