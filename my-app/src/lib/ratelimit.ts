const DEFAULT_LIMIT = 5;

export type RateLimitCheck = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter: number;
  pending?: Promise<unknown>;
  reason?: "mvp_bypass";
};

/**
 * MVP-friendly rate-limit shim.
 * The original DannFlow starter expects a limiter here, but this project does
 * not need Upstash Redis for the classroom-concern MVP.
 */
export async function verifyRateLimit(
  identifier: string,
  namespace = "default",
): Promise<RateLimitCheck> {
  void identifier;
  void namespace;

  return {
    success: true,
    limit: DEFAULT_LIMIT,
    remaining: DEFAULT_LIMIT,
    reset: Date.now(),
    retryAfter: 0,
    reason: "mvp_bypass",
  };
}

export function isDurableRateLimitConfigured(): boolean {
  return true;
}
