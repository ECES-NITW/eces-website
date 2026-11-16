declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    ORGANIZER_ORIGIN?: string;
    ORGANIZER_RATE_LIMIT?: RateLimit;
  }
}
