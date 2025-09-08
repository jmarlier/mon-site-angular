import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const browserDistFolder = join(import.meta.dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Basic security headers without external deps (helmet alternative)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-XSS-Protection', '0');
  if (process.env['NODE_ENV'] === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// Parse JSON bodies for API routes
app.use(express.json());

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/{*splat}', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve favicon with no-cache to pick up changes quickly
 */
app.get('/favicon.ico', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(join(browserDistFolder, 'favicon.ico'));
});

/**
 * Serve static files from /browser
 */
app.use(
  express.static(browserDistFolder, {
    maxAge: process.env['NODE_ENV'] === 'production' ? '1y' : '0',
    index: false,
    redirect: false,
  }),
);

/**
 * Very small in-memory rate limiter (IP based) for /api/contact
 */
const rateMap = new Map<string, { count: number; ts: number }>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000; // 1 minute
  const limit = 10; // 10 req/min per IP
  const entry = rateMap.get(ip) || { count: 0, ts: now };
  if (now - entry.ts > windowMs) {
    entry.count = 0;
    entry.ts = now;
  }
  entry.count += 1;
  rateMap.set(ip, entry);
  return entry.count > limit;
}

/**
 * Simple validation helper
 */
function isNonEmptyString(v: unknown, max = 500): v is string {
  return typeof v === 'string' && v.trim().length > 0 && v.length <= max;
}

/**
 * Contact endpoint (server-side email sending should be plugged here)
 * NOTE: Replace the console.log with a proper mail transport (e.g., nodemailer) using env secrets.
 */
app.post('/api/contact', (req, res) => {
  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  const { name, user_email, subject, message } = req.body || {};
  if (!isNonEmptyString(name, 100) || !isNonEmptyString(user_email, 200) || !isNonEmptyString(subject, 200) || !isNonEmptyString(message, 5000)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }

  // TODO: Plug a real mailer using environment variables.
  // Example (pseudo): await mailer.send({ to: process.env.CONTACT_TO, from: process.env.CONTACT_FROM, subject, text: ... })
  console.log('[contact] New message:', { name, user_email, subject, size: message.length });
  return res.status(204).end();
});

/**
 * Handle all other requests by rendering the Angular application.
 */
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).send('Not Found');
});

/**
 * Error handler
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // Avoid leaking internals in production
  const status = err?.status || 500;
  const body = process.env['NODE_ENV'] === 'production' ? 'Internal Server Error' : String(err?.stack || err);
  console.error('[server error]', err);
  res.status(status).send(body);
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, (error) => {
    if (error) {
      throw error;
    }

    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * Request handler used by the Angular CLI (for dev-server and during build) or Firebase Cloud Functions.
 */
export const reqHandler = createNodeRequestHandler(app);
