interface RateLimitInfo {
  timestamp: number;
  count: number;
}

const RATE_LIMIT = 10; // 每分钟请求次数
const WINDOW_SIZE = 60 * 1000; // 1分钟窗口期

export async function rateLimit(request: Request): Promise<boolean> {
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  const now = Date.now();
  
  // 在实际项目中，这里应该使用 KV 存储或 Durable Objects
  // 这里使用内存存储只是示例
  const rateLimitInfo: RateLimitInfo = {
    timestamp: now,
    count: 1
  };

  if (rateLimitInfo.timestamp + WINDOW_SIZE < now) {
    rateLimitInfo.timestamp = now;
    rateLimitInfo.count = 1;
    return true;
  }

  if (rateLimitInfo.count >= RATE_LIMIT) {
    return false;
  }

  rateLimitInfo.count += 1;
  return true;
} 