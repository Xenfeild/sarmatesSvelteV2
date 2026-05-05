// Configuration PM2 — gestionnaire de processus pour le VPS
// Lancer avec : pm2 start ecosystem.config.cjs
// Sauvegarder au démarrage : pm2 save && pm2 startup

module.exports = {
  apps: [
    {
      name: 'sarmates-frontend',
      script: './sarmatesSvelteV2/build/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,                          // port du frontend SvelteKit
        ORIGIN: 'https://sarmates-music.com' // obligatoire avec adapter-node
      }
    },
    {
      name: 'sarmates-backend',
      script: './backend/server.js',
      env_file: './backend/.env',
      env: {
        NODE_ENV: 'production',
        PORT: 3000                           // port de l'API Express
      }
    }
  ]
};
