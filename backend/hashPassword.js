const argon2 = require('argon2');
require('dotenv').config();

const username = process.env.ADMIN_USERNAME;
const password = process.env.ADMIN_PASSWORD;

argon2.hash(password).then(hash => {
    console.log(`INSERT INTO users (username, password) VALUES ('${username}', '${hash}');`);
}).catch(err => {
    console.error('Erreur lors du hachage du mot de passe:', err);
});