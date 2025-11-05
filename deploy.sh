#!/bin/bash
set -e

OUTPUT_DIR="dist/mon-site-perso"
OUTPUT_BROWSER="$OUTPUT_DIR/browser"
DEPLOY_DIR="dist_deploy"

# Vérifier que la clé SSH pour O2Switch est disponible
echo ">>> Vérification de la clé SSH O2Switch..."
if ! ssh-add -l | grep -q "cocotier"; then
  echo ">>> Ajout de la clé SSH O2Switch..."
  ssh-add --apple-use-keychain ~/.ssh/id_ed25519_cocotier
fi

echo ">>> Build Angular (production, static)..."
ng build --configuration production

echo ">>> Synchronisation des fichiers buildés (rsync)..."
# Créer le dossier de déploiement s'il n'existe pas
mkdir -p $DEPLOY_DIR

# Sauvegarder le fichier .env existant s'il existe
if [ -f "$DEPLOY_DIR/.env" ]; then
  echo ">>> Sauvegarde du fichier .env existant..."
  cp "$DEPLOY_DIR/.env" "$DEPLOY_DIR/.env.backup"
fi

# Utiliser rsync pour copier seulement les fichiers modifiés
# --delete supprime les fichiers qui n'existent plus dans la source
# --exclude pour éviter de copier certains fichiers si nécessaire
rsync -av --delete \
  --exclude='.git*' \
  --exclude='.DS_Store' \
  --exclude='.env' \
  $OUTPUT_BROWSER/ $DEPLOY_DIR/

# Restaurer ou copier le fichier .env
if [ -f "$DEPLOY_DIR/.env.backup" ]; then
  echo ">>> Restauration du fichier .env..."
  mv "$DEPLOY_DIR/.env.backup" "$DEPLOY_DIR/.env"
elif [ -f ".env" ]; then
  echo ">>> Copie du fichier .env..."
  cp .env $DEPLOY_DIR/.env
else
  echo ">>> ⚠️  Fichier .env non trouvé localement"
fi

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