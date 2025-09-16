import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const app = express();
const angularApp = new AngularNodeAppEngine();
const browserDistFolder = join(import.meta.dirname, '../browser');

// ➤ Servir les fichiers statiques
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
  }),
);

// ➤ Route Angular universelle
app.use(async (req, res, next) => {
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
app.use((_, res) => {
  res.status(404).send('Not Found');
});

// ➤ Lancement du serveur uniquement en mode standalone (local)
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] ? Number(process.env['PORT']) : 4000;
  const host = '0.0.0.0';
  app.listen(port, host, () => {
    console.log(`✅ Angular SSR server running at http://${host}:${port}`);
  });
}

// ➤ Exporter pour Passenger
export default app;

// ➤ Export handler (utile pour tests/Firebase)
export const reqHandler = createNodeRequestHandler(app);