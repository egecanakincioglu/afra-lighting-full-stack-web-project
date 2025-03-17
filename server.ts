import express, { type Request, type Response } from "express";
import next from "next";
import path from "path";
import { allowedVisitPaths, rateLimitConfig } from "./src/lib/config/files";
import { connection, visitorLogger } from "./src/modules/database/exports";
import { startTokenVerification } from "./src/modules/auth/authService";
import { isLocalIP, normalizeIP } from "./src/lib/helpers/strings";
import { RateLimiter } from "./src/modules/classes/RateLimiter";

const rateLimiterMap = new Map<string, RateLimiter>();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(async () => {
  const server = express();
  await connection.initalize();
  startTokenVerification();

  server
    .all("*", async (req: Request, res: Response) => {
      const isPassed = await handleRateLimit(req, res);

      if (!isPassed) return;

      await handleVisit(req);
      return handle(req, res);
    })
    .listen(port, (err?: Error) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
});

async function handleRateLimit(req: Request, res: Response): Promise<boolean> {
  const path = req.path;

  if (!path.startsWith("/api/")) return true;

  const apiPath = path.replace("/api/", "");
  const rateLimit = rateLimitConfig[apiPath];

  if (!rateLimit) return true;

  const ip = req.ip;

  if (!ip) {
    res.status(400).json({ message: "IP not found" });
    return false;
  }

  const ipAddress = normalizeIP(ip);

  if (!dev && isLocalIP(ipAddress)) {
    return true;
  }

  const rateLimiter =
    rateLimiterMap.get(apiPath) ??
    new RateLimiter(rateLimit.limit, rateLimit.interval);

  if (!rateLimiterMap.has(apiPath)) {
    rateLimiterMap.set(apiPath, rateLimiter);
  }

  const newRateLimiter = rateLimiterMap.get(apiPath);

  if (!newRateLimiter) return true;

  if (newRateLimiter.isRateLimited(ipAddress)) {
    res.status(429).json({ message: "Too many requests" });
    return false;
  }

  newRateLimiter.addRequest(ipAddress);
  return true;
}

async function handleVisit(req: Request) {
  let pageVisited: string = req.path;

  const canLoggable = allowedVisitPaths.some(
    (allowedPath) =>
      pageVisited.startsWith(`/${allowedPath}`) || pageVisited === `/`
  );

  if (!canLoggable) return;

  pageVisited = path.basename(
    pageVisited,
    "." + (pageVisited.split(".").at(-1) ?? "")
  );
  pageVisited = pageVisited === "" ? "mainPage" : pageVisited;

  const ipAddress = normalizeIP(
    req.ip ||
      (req.headers["x-forwarded-for"] as string | undefined) ||
      "Unknown IP"
  );

  if (!dev && isLocalIP(ipAddress)) return;

  return await visitorLogger.logVisitEntry(
    ipAddress,
    pageVisited,
    (req.headers["referrer"] as string | undefined) ?? "Unknown",
    req.headers["user-agent"] ?? "Unknown"
  );
}

export const config = {
  matcher: "/:path*",
};
