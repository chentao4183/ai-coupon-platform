import { kv } from '@vercel/kv';

/**
 * Rate limiting configuration using Vercel KV
 * Limits: 10 requests per minute per IP address
 */

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime?: number;
}

export async function checkRateLimit(
  ip: string,
  limit: number = 10,
  window: number = 60
): Promise<RateLimitResult> {
  const key = `rate-limit:${ip}`;

  try {
    const data = await kv.get(key);

    if (!data) {
      // First request in window
      const now = Math.floor(Date.now() / 1000);
      await kv.set(key, JSON.stringify({
        count: 1,
        remaining: limit - 1,
        resetTime: now + window
      }), { ex: window });

      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + window
      };
    }

    const rateLimitData = JSON.parse(data as string);
    const { count, remaining, resetTime } = rateLimitData;

    if (count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime
      };
    }

    // Increment counter
    const newCount = count + 1;
    const newRemaining = remaining - 1;
    await kv.set(key, JSON.stringify({
      count: newCount,
      remaining: newRemaining,
      resetTime
    }), { ex: window });

    return {
      allowed: true,
      remaining: newRemaining,
      resetTime
    };

  } catch (error) {
    // On KV error, allow request but log error
    console.error('Rate limit check failed:', error);
    return {
      allowed: true,
      remaining: 0
    };
  }
}

/**
 * Reset rate limit for a specific IP (admin function)
 */
export async function resetRateLimit(ip: string): Promise<void> {
  const key = `rate-limit:${ip}`;
  await kv.del(key);
}

/**
 * Get current rate limit status without incrementing
 */
export async function getRateLimitStatus(ip: string): Promise<RateLimitResult | null> {
  const key = `rate-limit:${ip}`;

  try {
    const data = await kv.get(key);
    if (!data) return null;

    const rateLimitData = JSON.parse(data as string);
    return rateLimitData;
  } catch (error) {
    console.error('Failed to get rate limit status:', error);
    return null;
  }
}
