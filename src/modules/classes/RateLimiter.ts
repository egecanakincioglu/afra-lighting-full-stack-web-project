import { isLocalIP } from "../../lib/helpers/strings";

const dev = process.env.NODE_ENV !== "production";

export class RateLimiter {
  private rateLimitMap = new Map<string, number>();
  private intervalSeconds: number;
  private requestLimit: number;

  constructor(requestLimit: number, intervalSeconds = 60) {
    this.intervalSeconds = intervalSeconds;
    this.requestLimit = requestLimit;
  }

  public addRequest(ip: string): this {
    if (!dev && isLocalIP(ip)) return this;

    const currentRequest = this.rateLimitMap.get(ip) ?? 0;
    this.rateLimitMap.set(ip, currentRequest + 1);

    setTimeout(() => {
      this.timeoutRequest(ip);
    }, this.intervalSeconds * 1000);

    return this;
  }

  public timeoutRequest(ip: string): this {
    if (!dev && isLocalIP(ip)) return this;

    const currentRequest = this.rateLimitMap.get(ip) ?? 0;

    if (currentRequest === 0) return this;

    this.rateLimitMap.set(ip, Math.max(currentRequest - 1, 0));

    if (this.rateLimitMap.get(ip) === 0) {
      this.rateLimitMap.delete(ip);
    }

    return this;
  }

  public isRateLimited(ip: string): boolean {
    if (!dev && isLocalIP(ip)) return false;

    const currentRequest = this.rateLimitMap.get(ip) ?? 0;
    return currentRequest >= this.requestLimit;
  }
}
