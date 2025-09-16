import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Résolution fiable de __dirname (au lieu de import.meta.dirname)
const __dirname = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = join(__dirname, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

// Debug logs au démarrage
console.log('>>> process.cwd():', process.cwd());
console.log('>>> __dirname:', __dirname);
console.log('>>> browserDistFolder:', browserDistFolder);
console.log('>>> NODE_ENV:', process.env['NODE_ENV']);
console.log('>>> PORT (if set):', process.env['PORT']);

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

// Serve favicon
app.get('/favicon.ico', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.sendFile(join(browserDistFolder, 'favicon.ico'));
});

// Serve static files from /browser
app.use(
  express.static(browserDistFolder, {
    maxAge: process.env['NODE_ENV'] === 'production' ? '1y' : '0',
    index: false,
    redirect: false,
  }),
);

// SSR handler
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) =>
      response ? writeResponseToNodeResponse(response, res) : next(),
    )
    .catch(next);
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Not Found');
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const status = err?.status || 500;
  const body =
    process.env['NODE_ENV'] === 'production'
      ? 'Internal Server Error'
      : String(err?.stack || err);
  console.error('[server error]', err);
  res.status(status).send(body);
});

// Start server if main module
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  console.log('>>> Final app.listen PORT =', port);

  app.listen(port, (error) => {
    if (error) {
      throw error;
    }
    console.log(`>>> Node Express server listening on http://localhost:${port}`);
  });
}

// Export handler for Angular CLI / Firebase
export const reqHandler = createNodeRequestHandler(app);