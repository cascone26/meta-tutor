// Simple in-memory cache for API responses.
// Prevents duplicate API calls for identical inputs.

interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

const DEFAULT_TTL = 1000 * 60 * 60; // 1 hour

export function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCache(key: string, data: unknown, ttl = DEFAULT_TTL) {
  // Keep cache bounded
  if (cache.size > 500) {
    const oldest = cache.keys().next().value;
    if (oldest) cache.delete(oldest);
  }
  cache.set(key, { data, expiresAt: Date.now() + ttl });
}

export function cacheKey(...parts: string[]): string {
  return parts.join("::");
}
