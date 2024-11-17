const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Importer multer

const app = express();
const port = process.env.PORT || 3000;

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


// News table


// Route pour récupérer tous les articles de news
app.get('/api/news', (req, res) => {
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


// Live table

// Route pour récupérer tous les événements live
app.get('/api/live', (req, res) => {
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
    const { address, event_date, link } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : null;
    db.run('INSERT INTO live (image, address, event_date, link) VALUES (?, ?, ?, ?)', [image, address, event_date, link], function(err) {
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
    const { address, event_date, link } = req.body;
    const image = req.file ? `/uploads/image/${req.file.filename}` : req.body.image;
    db.run('UPDATE live SET image = ?, address = ?, event_date = ?, link = ? WHERE id = ?', [image, address, event_date, link, id], function(err) {
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