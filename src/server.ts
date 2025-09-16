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


// ➤ Export handler (utile pour Firebase ou tests)
export const reqHandler = createNodeRequestHandler(app);