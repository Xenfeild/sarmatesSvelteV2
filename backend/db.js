const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite3'));
const argon2 = require('argon2');
require('dotenv').config({ path: path.join(__dirname, '.env') });

db.serialize(() => {
    // Table news
    db.run(`CREATE TABLE IF NOT EXISTS news(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        image TEXT,
        thumbnail TEXT,
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

    // Table users
    db.run(`CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

});

module.exports = db;