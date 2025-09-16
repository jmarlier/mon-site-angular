import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import { join } from 'node:path';

const app = express();
const angularApp = new AngularNodeAppEngine();
const browserDistFolder = join(import.meta.dirname, '../browser');

// ➤ Fichiers statiques
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

// ➤ Route de santé
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', env: process.env['NODE_ENV'] || 'dev' });
});

// ➤ Routes Angular SSR
app.use(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await angularApp.handle(req);
    if (response) {
      writeResponseToNodeResponse(response, res);
    } else {
      next();
    }
  } catch (err) {
    console.error('❌ SSR Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// ➤ Fallback 404
app.use((_req: Request, res: Response) => {
  res.status(404).send('Not Found');
});

// ➤ Lancement standalone (local/dev)
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] ? Number(process.env['PORT']) : 4000;
  const host = '0.0.0.0';

  app.listen(port, host, () => {
    console.log(`✅ Angular SSR server listening on http://${host}:${port}`);
    console.log('>>> NODE_ENV:', process.env['NODE_ENV']);
    console.log('>>> PORT (Passenger):', process.env['PORT']);
  });
}

// ➤ Export handler pour Passenger
export const reqHandler = createNodeRequestHandler(app);