<?php
// Configuration PDO - Détection automatique d'environnement

// Détection de l'environnement
$isProduction = !in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'localhost:5175']);

if ($isProduction) {
    // PRODUCTION - Hostinger (à configurer selon tes paramètres Hostinger)
    $host = 'localhost'; // ou l'host Hostinger
    $dbname = 'u123456789_sarmates'; // ton nom de BDD Hostinger  
    $username = 'u123456789_user'; // ton user Hostinger
    $password = 'ton_mot_de_passe_hostinger'; // à modifier
    
    try {
        $pdo1 = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
        $pdo1->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo1->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    } catch(PDOException $e) {
        die('Erreur de connexion production : ' . $e->getMessage());
    }
    
} else {
    // DÉVELOPPEMENT LOCAL - SQLite (simple et sans config)
    $dbPath = __DIR__ . '/../../../../backend/contacts_local.sqlite3';
    
    try {
        $pdo1 = new PDO("sqlite:$dbPath");
        $pdo1->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo1->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        
        // Création automatique de la table si elle n'existe pas
        $pdo1->exec("CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip TEXT NOT NULL,
            authTime INTEGER NOT NULL,
            prenom TEXT,
            nom TEXT,
            mail TEXT,
            company TEXT,
            message TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
        
    } catch(PDOException $e) {
        die('Erreur de connexion locale : ' . $e->getMessage());
    }
}
?>