const sqlite3 = require('sqlite3').verbose();
const argon2 = require('argon2');
const readline = require('readline');

const db = new sqlite3.Database('./db.sqlite3');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('=== Modification du mot de passe utilisateur ===\n');

// Afficher les utilisateurs existants
db.all('SELECT id, username FROM users', (err, rows) => {
    if (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        return;
    }

    console.log('Utilisateurs existants :');
    rows.forEach(row => {
        console.log(`  ${row.id}. ${row.username}`);
    });
    console.log('');

    rl.question('Entrez l\'ID de l\'utilisateur à modifier : ', (userId) => {
        // Vérifier que l'utilisateur existe
        db.get('SELECT username FROM users WHERE id = ?', [userId], (err, row) => {
            if (err) {
                console.error('Erreur:', err);
                rl.close();
                db.close();
                return;
            }

            if (!row) {
                console.log('Utilisateur non trouvé !');
                rl.close();
                db.close();
                return;
            }

            console.log(`Modification du mot de passe pour: ${row.username}`);
            
            rl.question('Entrez le nouveau mot de passe : ', async (newPassword) => {
                try {
                    // Hacher le nouveau mot de passe
                    const hashedPassword = await argon2.hash(newPassword);
                    
                    // Mettre à jour en base
                    db.run('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId], function(err) {
                        if (err) {
                            console.error('Erreur lors de la mise à jour:', err);
                        } else {
                            console.log(`✅ Mot de passe mis à jour avec succès pour l'utilisateur ${row.username} !`);
                        }
                        
                        rl.close();
                        db.close();
                    });
                    
                } catch (error) {
                    console.error('Erreur lors du hachage:', error);
                    rl.close();
                    db.close();
                }
            });
        });
    });
});