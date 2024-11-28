const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Importer multer
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Configuration de multer pour le téléchargement des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads', 'image');
        console.log(`Uploading file to: ${uploadPath}`);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        console.log(`Saving file as: ${filename}`);
        cb(null, filename);
    }
});

const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de la base de données
const dbPath = path.resolve(__dirname, './db.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données SQLite');
});

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}


// Route pour gérer la connexion
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });

        argon2.verify(user.password, password).then(match => { // Utiliser argon2.verify
            if (!match) return res.status(401).json({ error: 'Invalid username or password' });

            const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        }).catch(err => {
            res.status(500).json({ error: err.message });
        });
    });
});

// Routes protégées par l'authentification
app.use('/api/admin', authenticateToken);

// ******** CRUD opérations ********


// ******** News table ********


// Route pour récupérer tous les articles de news
app.get('/api/news', (req, res) => {
    const limit = req.query.limit ? `LIMIT ${req.query.limit}` : '';
    db.all('SELECT * FROM news ORDER BY date DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour récupérer un article de news par ID
app.get('/api/news/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM news WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'News not found' });
            return;
        }
        res.json(row);
    });
});

// Route pour ajouter un nouvel article de news avec une image
app.post('/api/news', upload.single('image'), (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : null;
    console.log(`Received file: ${req.file ? req.file.filename : 'No file uploaded'}`);
    console.log(`Image path: ${image}`);
    db.run('INSERT INTO news (title, image, content) VALUES (?, ?, ?)', [title, image, content], function(err) {
        if (err) {
            console.error('Error inserting news:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route pour mettre à jour un article de news
app.put('/api/news/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : req.body.image;
    db.run('UPDATE news SET title = ?, image = ?, content = ? WHERE id = ?', [title, image, content, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Route pour supprimer un article de news
app.delete('/api/news/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Received DELETE request for news ID: ${id}`);
    db.run('DELETE FROM news WHERE id = ?', id, function(err) {
        if (err) {
            console.error(`Error deleting news ID: ${id}`, err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            console.warn(`News ID: ${id} not found`);
            res.status(404).json({ error: 'News not found' });
            return;
        }
        console.log(`News ID: ${id} deleted successfully`);
        res.status(200).json({ message: 'News deleted successfully' });
    });
});


// ******* Live table ********

// Route pour récupérer tous les événements live
app.get('/api/live', (req, res) => {
    const limit = req.query.limit ? `LIMIT ${req.query.limit}` : '';
    db.all('SELECT * FROM live ORDER BY event_date DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour récupérer un événement live par ID
app.get('/api/live/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM live WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Live event not found' });
            return;
        }
        res.json(row);
    });
});

// Route pour ajouter un nouvel événement live avec une image
app.post('/api/live', upload.single('image'), (req, res) => {
    const { event_name, address, event_date, link } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : null;
    db.run('INSERT INTO live (image, event_name, address, event_date, link) VALUES (?, ?, ?, ?, ?)', [image, event_name, address, event_date, link], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route pour mettre à jour un événement live
app.put('/api/live/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { event_name, address, event_date, link } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : req.body.image;
    db.run('UPDATE live SET image = ?, event_name = ?, address = ?, event_date = ?, link = ? WHERE id = ?', [image, event_name, address, event_date, link, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Route pour supprimer un événement live
app.delete('/api/live/:id', (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM live WHERE id = ?', id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Live event not found' });
            return;
        }
        res.status(200).json({ message: 'Live event deleted successfully' });
    });
});


// ******* Presse table ********

// Add press
app.post('/api/press', upload.single('image'), (req, res) => {
    const { title, content, date, link } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : null;
    const sql = `INSERT INTO press (title, image, content, date, link) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [title, image, content, date, link], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route pour récupérer tous les articles de presse
app.get('/api/press', (req, res) => {
    const limit = req.query.limit ? `LIMIT ${req.query.limit}` : '';
    const sql = `SELECT * FROM press`;
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Route pour mettre à jour un article de presse
app.put('/api/press/:id', upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, content, date, link } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : req.body.image;
    const sql = `UPDATE press SET title = ?, image = ?, content = ?, date = ?, link = ? WHERE id = ?`;
    db.run(sql, [title, image, content, date, link, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Press entry not found' });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Route pour supprimer un article de presse
app.delete('/api/press/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM press WHERE id = ?`;
    db.run(sql, id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Press entry not found' });
            return;
        }
        res.status(200).json({ message: 'Press entry deleted successfully' });
    });
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

// Gérer la fermeture propre
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la base:', err);
        } else {
            console.log('Connexion à la base de données fermée');
        }
        process.exit(err ? 1 : 0);
    });
});

module.exports = { app, db };