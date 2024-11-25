const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.sqlite3');

db.serialize(() => {
    // Table news
    db.run(`CREATE TABLE IF NOT EXISTS news(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image TEXT,
        content TEXT,
        date TEXT DEFAULT (datetime('now','localtime'))
        )`);

    // Table press
    db.run(`CREATE TABLE IF NOT EXISTS press(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image TEXT,
        content TEXT,
        date TEXT,
        link TEXT
        )`);

    // table live
    db.run(`CREATE TABLE IF NOT EXISTS live(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image TEXT,
        address TEXT,
        event_date TEXT,
        event_name TEXT,
        link TEXT
    )`);
});

module.exports = db;