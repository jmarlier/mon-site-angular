import {
  AngularNodeAppEngine,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { join } from 'node:path';

const app = express();
const angularApp = new AngularNodeAppEngine();
const browserDistFolder = join(import.meta.dirname, '../browser');

// ➤ Servir les fichiers statiques Angular
app.use(express.static(browserDistFolder, { maxAge: '1y', index: false }));

// ➤ Routes Angular SSR
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => {
      if (response) writeResponseToNodeResponse(response, res);
      else next();
    })
    .catch((err) => {
      console.error('❌ SSR Error:', err);
      res.status(500).send('Internal Server Error');
    });
});

// ➤ Fallback 404
app.use((_req, res) => res.status(404).send('Not Found'));

// ➤ Lancement en local
if (isMainModule(import.meta.url)) {
  const port = Number(process.env['PORT'] || 4000);
  app.listen(port, '0.0.0.0', () => {
    console.log(`✅ Angular SSR server running at http://0.0.0.0:${port}`);
  });
}

export default app;