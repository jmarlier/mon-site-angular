#!/bin/bash

echo "🧹 Nettoyage..."
rm -rf dist .angular

echo "🔨 Compilation SSR..."
npm run build

echo "🚀 Lancement serveur SSR..."
node dist/mon-site-perso/server/server.mjs