/**
 * @fileoverview High-performance, production-grade in-memory rate limiting utility.
 * Implements a sliding window rate-limiter with active memory pruning to prevent memory leaks.
 * Supports secure client IP resolution from upstream reverse proxies (Vercel, Cloudflare, etc.).
 *
 * @module lib/rateLimit
 */

interface RateLimitBucket {
  timestamps: number[];
}

// In-memory cache for IP rate tracking
const ipCache = new Map<string, RateLimitBucket>();

// Prune interval to clean up stale entries (every 10 minutes)
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 10 * 60 * 1000;

function cleanupCache() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  for (const [ip, bucket] of ipCache.entries()) {
    // Keep only timestamps within the last 15 minutes to clear out historical items
    const cutoff = now - 15 * 60 * 1000;
    const active = bucket.timestamps.filter(ts => ts > cutoff);
    if (active.length === 0) {
      ipCache.delete(ip);
    } else {
      bucket.timestamps = active;
    }
  }
  lastCleanup = now;
}

/**
 * Extracts the real client IP from incoming request headers securely.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    // Take the first IP if multiple are specified in the proxy chain
    const parts = forwardedFor.split(",");
    const ip = parts[0]?.trim();
    if (ip) return ip;
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  return "127.0.0.1";
}

/**
 * Checks if a request exceeds the configured rate limits for the given IP.
 * Uses a sliding window algorithm.
 * 
 * @param ip The client's IP address.
 * @param limit Max number of allowed requests in the window.
 * @param windowMs Window duration in milliseconds.
 * @returns Rate limit status details.
 */
export function checkRateLimit(
  ip: string,
  limit: number,
  windowMs: number
): {
  success: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
} {
  cleanupCache();

  const now = Date.now();
  let bucket = ipCache.get(ip);

  if (!bucket) {
    bucket = { timestamps: [] };
    ipCache.set(ip, bucket);
  }

  // Filter timestamps to only keep those within the sliding window
  const windowStart = now - windowMs;
  bucket.timestamps = bucket.timestamps.filter(ts => ts > windowStart);

  const count = bucket.timestamps.length;
  const success = count < limit;

  if (success) {
    bucket.timestamps.push(now);
  }

  const remaining = Math.max(0, limit - bucket.timestamps.length);
  const oldestTimestamp = bucket.timestamps[0] || now;
  const resetTime = oldestTimestamp + windowMs;

  return {
    success,
    limit,
    remaining,
    resetTime,
  };
}
