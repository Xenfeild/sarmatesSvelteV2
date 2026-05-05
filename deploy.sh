#!/bin/bash
# deploy.sh — Script de déploiement sur le VPS
# Usage : bash deploy.sh
# Prérequis sur le VPS : Node.js 20+, PM2, Nginx, Certbot

set -e  # Arrêt immédiat si une commande échoue

echo "=== Déploiement sarmates-music.com ==="

# 1. Récupérer les derniers changements
echo "[1/5] Git pull..."
git pull origin master

# 2. Installer les dépendances backend
echo "[2/5] Dépendances backend..."
cd backend
npm install --production
cd ..

# 3. Installer et builder le frontend
echo "[3/5] Build frontend..."
cd sarmatesSvelteV2
npm install
npm run build
cd ..

# 4. Redémarrer les processus PM2
echo "[4/5] Redémarrage PM2..."
pm2 reload ecosystem.config.cjs --update-env

# 5. Vérifier
echo "[5/5] Statut PM2 :"
pm2 status

echo "=== Déploiement terminé ==="
