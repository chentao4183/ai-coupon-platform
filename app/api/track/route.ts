import { NextRequest, NextResponse } from 'next/server';
import { getPlatform, incrementClicks } from '@/lib/kv';
import { checkRateLimit } from '@/lib/rate-limit';
import { log } from '@/lib/logger';

/**
 * Extract client IP from request headers
 */
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  return 'unknown';
}

/**
 * POST /api/track
 *
 * Tracks clicks on platform affiliate links
 * Request body: { platformId: string }
 * Response: { success: true, clicks: number, url: string }
 *
 * Rate limited: 10 requests per minute per IP
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      log('error', 'track_api_invalid_json', { error: String(error) });
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { platformId } = body;

    // Validate platformId
    if (!platformId || typeof platformId !== 'string') {
      log('error', 'track_api_invalid_platformId', { platformId });
      return NextResponse.json(
        { error: 'Invalid platformId' },
        { status: 400 }
      );
    }

    // Get client IP
    const ip = getClientIP(request);

    // Check rate limit
    const rateLimit = await checkRateLimit(ip);
    if (!rateLimit.allowed) {
      log('warn', 'track_api_rate_limited', { ip, platformId });
      return NextResponse.json(
        {
          error: 'Too many requests',
          message: 'Rate limit exceeded. Please try again later.',
          resetTime: rateLimit.resetTime
        },
        { status: 429 }
      );
    }

    // Validate platform exists
    const platform = await getPlatform(platformId);
    if (!platform) {
      log('error', 'track_api_platform_not_found', { platformId, ip });
      return NextResponse.json(
        { error: 'Platform not found' },
        { status: 404 }
      );
    }

    // Increment click count
    const clicks = await incrementClicks(platformId);

    // Log successful tracking
    log('info', 'click_tracked', {
      platformId,
      platformName: platform.name,
      ip,
      clicks,
      userAgent: request.headers.get('user-agent'),
      referer: request.headers.get('referer')
    });

    // Return success with platform URL and updated click count
    return NextResponse.json({
      success: true,
      clicks,
      url: platform.affiliateUrl,
      platformName: platform.name,
      remaining: rateLimit.remaining
    }, {
      status: 200,
      headers: {
        // Cache control to prevent caching
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        // Rate limit info headers
        'X-RateLimit-Limit': '10',
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        'X-RateLimit-Reset': rateLimit.resetTime?.toString() || ''
      }
    });

  } catch (error) {
    // Log unexpected errors
    log('error', 'track_api_error', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * OPTIONS /api/track
 *
 * Handle CORS preflight requests
 */
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
}
