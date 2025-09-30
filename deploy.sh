#!/bin/bash
set -e

OUTPUT_DIR="dist/mon-site-perso"
OUTPUT_BROWSER="$OUTPUT_DIR/browser"
DEPLOY_DIR="dist_deploy"

echo ">>> Build Angular (production, static)..."
ng build --configuration production

echo ">>> Synchronisation des fichiers buildés (rsync)..."
# Créer le dossier de déploiement s'il n'existe pas
mkdir -p $DEPLOY_DIR

# Utiliser rsync pour copier seulement les fichiers modifiés
# --delete supprime les fichiers qui n'existent plus dans la source
# --exclude pour éviter de copier certains fichiers si nécessaire
rsync -av --delete \
  --exclude='.git*' \
  --exclude='.DS_Store' \
  $OUTPUT_BROWSER/ $DEPLOY_DIR/

# Renommer htaccess -> .htaccess si le fichier sans point est présent (cas de certains dépôts)
if [ -f "$DEPLOY_DIR/htaccess" ]; then
  echo ">>> Renommage htaccess -> .htaccess"
  mv "$DEPLOY_DIR/htaccess" "$DEPLOY_DIR/.htaccess"
fi

echo ">>> Vérification des changements Git..."
# Vérifier s'il y a des changements avant de committer
if git diff --quiet --exit-code $DEPLOY_DIR; then
  echo ">>> Aucun changement détecté, pas de commit nécessaire."
else
  echo ">>> Commit & push sur la branche production..."
  git add $DEPLOY_DIR
  git commit -m "Deploy $(date +'%Y-%m-%d %H:%M:%S')"
  git subtree push --prefix $DEPLOY_DIR production production
fi

echo ">>> ✅ Déploiement terminé avec succès."