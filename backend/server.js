const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const multer = require('multer'); // Import multer
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const sharp = require('sharp'); // Import sharp
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET non défini dans les variables d\'environnement');
    process.exit(1);
}
const secretKey = process.env.JWT_SECRET;


//  ***** mailing function *****

//  nodemailer Configuration
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction de validation des emails
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
}

// Fonction de nettoyage des chaînes de texte brut (emails, noms d'utilisateur)
function sanitizeString(str, maxLength = 1000) {
    if (!str || typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength);
}

// Fonction de nettoyage avec échappement HTML (protection XSS pour contenu stocké en DB)
function sanitizeHtml(str, maxLength = 1000) {
    if (!str || typeof str !== 'string') return '';
    return str
        .trim()
        .slice(0, maxLength)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// Limiteur anti-spam sur le formulaire de contact
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Trop de messages envoyés. Réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});
    
// routes for mailing
app.post('/send-email', contactLimiter, (req, res) => {
    const { firstName, lastName, email, company, message } = req.body;
    
    // Validation des données
    if (!firstName || !lastName || !email || !message) {
        return res.status(400).json({ error: 'Champs requis manquants' });
    }
    
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Email invalide' });
    }
    
    // Nettoyage et limitation des données
    const cleanFirstName = sanitizeString(firstName, 50);
    const cleanLastName = sanitizeString(lastName, 50);
    const cleanCompany = sanitizeString(company, 100);
    const cleanMessage = sanitizeString(message, 5000);

    const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: 'Contact Form Submission',
    text: `Name: ${cleanFirstName} ${cleanLastName}\nEmail: ${email}\nCompany: ${cleanCompany}\nMessage: ${cleanMessage}`
};

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        } else {
            res.status(200).json({ message: 'Email sent' });
        }
    });
});

// ******** Routes download ********

// Configuration de multer pour le téléchargement des images
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads', 'image');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const filename = Date.now() + path.extname(file.originalname);
        cb(null, filename);
    }
});

// Filtre MIME : seules les images JPEG, PNG et WebP sont autorisées
const imageFileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non autorisé. Seules les images JPEG, PNG et WebP sont acceptées.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// Middleware
app.use(express.json({ limit: '10mb' })); // Limiter taille des requêtes
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
        : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Servir les fichiers statiques du dossier 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuration de la base de données
const dbPath = path.resolve(__dirname, './db.sqlite3');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
});

// Middleware pour vérifier le token JWT
function authenticateToken(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, secretKey, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

// Limiteur de tentatives de connexion (protection brute force)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.' },
    standardHeaders: true,
    legacyHeaders: false
});


// Route pour gérer la connexion
app.post('/api/login', loginLimiter, (req, res) => {
    const { username, password } = req.body;
    
    
    // Validation des données
    if (!username || !password) {
        return res.status(400).json({ error: 'Username et password requis' });
    }
    
    if (username.length > 100 || password.length > 500) {
        return res.status(400).json({ error: 'Données trop longues' });
    }
    
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.get(sql, [sanitizeString(username, 100)], (err, user) => {
        if (err) return res.status(500).json({ error: 'Erreur serveur' });
        if (!user) return res.status(401).json({ error: 'Invalid username or password' });

        argon2.verify(user.password, password).then(match => {
            if (!match) return res.status(401).json({ error: 'Invalid username or password' });

            const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' });
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 3600000
            });
            res.json({ success: true });
        }).catch(err => {
            res.status(500).json({ error: 'Erreur serveur' });
        });
    });
});

// Route de déconnexion
app.post('/api/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });
    res.json({ success: true });
});

// ******** CRUD opérations ********


// ******** News table ********


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
app.post('/api/news', authenticateToken, upload.single('image'), async (req, res) => {
    const title = sanitizeHtml(req.body.title, 255);
    const content = sanitizeHtml(req.body.content, 10000);
    let image = null;
    let thumbnail = null;

    if (req.file) {
        const timestamp = Date.now();
        const outputPath = path.join(__dirname, 'uploads', 'image', `${timestamp}.webp`);
        const thumbnailPath = path.join(__dirname, 'uploads', 'image', 'thumbnail', `${timestamp}.webp`);
        
        try {
            // Créer la version en taille réelle
            await sharp(req.file.path)
                .toFormat('webp')
                .toFile(outputPath);
            image = `/uploads/image/${path.basename(outputPath)}`;

            // Créer la miniature
            await sharp(req.file.path)
                .resize(290, 250)
                .toFormat('webp')
                .toFile(thumbnailPath);
            thumbnail = `/uploads/image/thumbnail/${path.basename(thumbnailPath)}`;
        } catch (err) {
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    db.run('INSERT INTO news (title, image, thumbnail, content) VALUES (?, ?, ?, ?)', [title, image, thumbnail, content], function(err) {
        if (err) {
            console.error('Error inserting news:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route pour mettre à jour un article de news
app.put('/api/news/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const title = sanitizeHtml(req.body.title, 255);
    const content = sanitizeHtml(req.body.content, 10000);
    let image = req.body.image;
    let thumbnail = req.body.thumbnail;

    if (req.file) {
        const timestamp = Date.now();
        const outputPath = path.join(__dirname, 'uploads', 'image', `${timestamp}.webp`);
        const thumbnailPath = path.join(__dirname, 'uploads', 'image', 'thumbnail', `${timestamp}.webp`);

        try {
            // Créer la version en taille réelle
            await sharp(req.file.path)
                .toFormat('webp')
                .toFile(outputPath);
            image = `/uploads/image/${path.basename(outputPath)}`;

            // Créer la miniature
            await sharp(req.file.path)
                .resize(290, 250)
                .toFormat('webp')
                .toFile(thumbnailPath);
            thumbnail = `/uploads/image/thumbnail/${path.basename(thumbnailPath)}`;
        } catch (err) {
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    db.run('UPDATE news SET title = ?, image = ?, thumbnail = ?, content = ? WHERE id = ?', [title, image, thumbnail, content, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Route pour supprimer un article de news
app.delete('/api/news/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM news WHERE id = ?', [id], function(err) {
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
        res.status(200).json({ message: 'News deleted successfully' });
    });
});


// ******* Live table ********

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
app.post('/api/live', authenticateToken, upload.single('image'), async (req, res) => {
    const event_name = sanitizeHtml(req.body.event_name, 255);
    const address = sanitizeHtml(req.body.address, 255);
    const event_date = sanitizeString(req.body.event_date, 50);
    const link = sanitizeHtml(req.body.link, 500);
    let image = null;

    // image compression precessing and rezising
    if (req.file) {
        const outputPath = path.join(__dirname, 'uploads', 'image', `${Date.now()}.webp`);
        try {
            await sharp(req.file.path)
                .resize(250, 340)
                .toFormat('webp')
                .toFile(outputPath);
            image = `/uploads/image/${path.basename(outputPath)}`;
        } catch (err) {
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    db.run('INSERT INTO live (image, event_name, address, event_date, link) VALUES (?, ?, ?, ?, ?)', [image, event_name, address, event_date, link], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route pour mettre à jour un événement live
app.put('/api/live/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const event_name = sanitizeHtml(req.body.event_name, 255);
    const address = sanitizeHtml(req.body.address, 255);
    const event_date = sanitizeString(req.body.event_date, 50);
    const link = sanitizeHtml(req.body.link, 500);
    let image = req.body.image;

    if (req.file) {
        const outputPath = path.join(__dirname, 'uploads', 'image', `${Date.now()}.webp`);
        try {
            await sharp(req.file.path)
                .resize(250, 340)
                .toFormat('webp')
                .toFile(outputPath);
            image = `/uploads/image/${path.basename(outputPath)}`;
        } catch (err) {
            return res.status(500).json({ error: 'Error processing image' });
        }
    }

    db.run('UPDATE live SET image = ?, event_name = ?, address = ?, event_date = ?, link = ? WHERE id = ?', [image, event_name, address, event_date, link, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ changes: this.changes });
    });
});

// Route pour supprimer un événement live
app.delete('/api/live/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run('DELETE FROM live WHERE id = ?', [id], function(err) {
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
app.post('/api/press', authenticateToken, upload.single('image'), async (req, res) => {
    const title = sanitizeHtml(req.body.title, 255);
    const content = sanitizeHtml(req.body.content, 10000);
    const date = sanitizeString(req.body.date, 50);
    const link = sanitizeHtml(req.body.link, 500);
    let image = null;

    if (req.file) {
        const outputPath = path.join(__dirname, 'uploads', 'image', `${Date.now()}.webp`);
        try {
            await sharp(req.file.path).toFormat('webp').toFile(outputPath);
            image = `/uploads/image/${path.basename(outputPath)}`;
            require('fs').unlink(req.file.path, () => {});
        } catch (err) {
            return res.status(500).json({ error: 'Erreur traitement image' });
        }
    }

    const sql = `INSERT INTO press (title, image, content, date, link) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [title, image, content, date, link], function(err) {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
            return;
        }
        res.status(201).json({ id: this.lastID });
    });
});

// Route pour récupérer tous les articles de presse
app.get('/api/press', (req, res) => {
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
app.put('/api/press/:id', authenticateToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const title = sanitizeHtml(req.body.title, 255);
    const content = sanitizeHtml(req.body.content, 10000);
    const date = sanitizeString(req.body.date, 50);
    const link = sanitizeHtml(req.body.link, 500);
    let image = req.body.image;

    if (req.file) {
        const outputPath = path.join(__dirname, 'uploads', 'image', `${Date.now()}.webp`);
        try {
            await sharp(req.file.path).toFormat('webp').toFile(outputPath);
            image = `/uploads/image/${path.basename(outputPath)}`;
            require('fs').unlink(req.file.path, () => {});
        } catch (err) {
            return res.status(500).json({ error: 'Erreur traitement image' });
        }
    }

    const sql = `UPDATE press SET title = ?, image = ?, content = ?, date = ?, link = ? WHERE id = ?`;
    db.run(sql, [title, image, content, date, link, id], function(err) {
        if (err) {
            res.status(500).json({ error: 'Erreur serveur' });
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
app.delete('/api/press/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM press WHERE id = ?`;
    db.run(sql, [id], function(err) {
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


// Gestionnaire d'erreurs global (notamment pour les rejets multer/upload)
app.use((err, req, res, next) => {
    if (err) {
        return res.status(400).json({ error: err.message || 'Erreur lors du traitement de la requête' });
    }
    next();
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