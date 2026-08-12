interface Bucket {
  count: number;
  reset: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = buckets.get(key);

  if (buckets.size > 5000) {
    for (const [k, v] of buckets) {
      if (v.reset < now) buckets.delete(k);
    }
  }

  if (!entry || entry.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }

  entry.count += 1;
  return entry.count <= limit;
}
