import sqlite3 from "sqlite3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'db');
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR);
const DB_FILE = path.join(DB_DIR, 'data.sqlite');
if (fs.existsSync(DB_FILE)) fs.unlinkSync(DB_FILE);

const db = new sqlite3.Database(DB_FILE);

db.serialize(() => {
    db.run(`CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, email TEXT, password_hash TEXT)`);
    db.run(`CREATE TABLE protected_data (id INTEGER PRIMARY KEY, user_id INTEGER, secret TEXT, FOREIGN KEY(user_id) REFERENCES users(id))`);

    db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, ['admin', 'admin@web.com', 'admin123']);
    db.run(`INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`, ['korisnik1', 'korisnik@web.com', 'lozinka123']);

    db.run(`INSERT INTO protected_data (user_id, secret) VALUES (?, ?)`, [1, 'Admin podaci']);
    db.run(`INSERT INTO protected_data (user_id, secret) VALUES (?, ?)`, [2, 'Korisnik podaci']);

    db.close();
});
