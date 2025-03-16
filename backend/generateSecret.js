// filepath: c:\Users\Xenfeild\Desktop\website\sarmatesSvelteV2-master\sarmatesSvelteV2-master\backend\generateSecret.js
const crypto = require('crypto');

function generateSecret() {
    return crypto.randomBytes(32).toString('base64');
}

const secret = generateSecret();
console.log(`Nouveau JWT_SECRET : ${secret}`);