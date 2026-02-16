import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimiterOptions {
    windowMs: number;
    maxRequests: number;
}

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: number;
}

export class InMemoryRateLimiter {
    private readonly windowMs: number;
    private readonly maxRequests: number;
    private readonly buckets = new Map<string, number[]>();

    constructor(options: RateLimiterOptions) {
        this.windowMs = options.windowMs;
        this.maxRequests = options.maxRequests;
    }

    check(key: string, now = Date.now()): RateLimitResult {
        const windowStart = now - this.windowMs;
        const timestamps = this.buckets.get(key) ?? [];
        const recent = timestamps.filter((timestamp) => timestamp > windowStart);

        if (recent.length >= this.maxRequests) {
            const oldestInWindow = recent[0];
            return {
                allowed: false,
                remaining: 0,
                resetAt: oldestInWindow + this.windowMs,
            };
        }

        recent.push(now);
        this.buckets.set(key, recent);

        return {
            allowed: true,
            remaining: this.maxRequests - recent.length,
            resetAt: now + this.windowMs,
        };
    }
}

const INQUIRY_RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const INQUIRY_RATE_LIMIT_MAX_REQUESTS = 5;

const inquiryRateLimiter = new InMemoryRateLimiter({
    windowMs: INQUIRY_RATE_LIMIT_WINDOW_MS,
    maxRequests: INQUIRY_RATE_LIMIT_MAX_REQUESTS,
});

let upstashRateLimiter: Ratelimit | null | undefined;

export function getInquiryRateLimitKey(email: string): string {
    return `inquiry:${email.toLowerCase()}`;
}

function getUpstashRateLimiter(): Ratelimit | null {
    if (upstashRateLimiter !== undefined) {
        return upstashRateLimiter;
    }

    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
        upstashRateLimiter = null;
        return upstashRateLimiter;
    }

    upstashRateLimiter = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(INQUIRY_RATE_LIMIT_MAX_REQUESTS, "10 m"),
        analytics: true,
        prefix: "vapor-aura",
    });

    return upstashRateLimiter;
}

function normalizeResetTimestamp(reset: number): number {
    return reset > 1_000_000_000_000 ? reset : reset * 1000;
}

export async function checkInquiryRateLimit(email: string): Promise<RateLimitResult> {
    const key = getInquiryRateLimitKey(email);
    const upstash = getUpstashRateLimiter();

    if (upstash) {
        try {
            const result = await upstash.limit(key);
            return {
                allowed: result.success,
                remaining: result.remaining,
                resetAt: normalizeResetTimestamp(result.reset),
            };
        } catch {
            // Fall back to in-memory limiting if remote rate limit is unavailable.
        }
    }

    return inquiryRateLimiter.check(key);
}
