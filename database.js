const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'tweets.db');
const db = new sqlite3.Database(dbPath);

function initDb() {
    return new Promise((resolve, reject) => {
        db.run(`CREATE TABLE IF NOT EXISTS processed_tweets (
            id TEXT PRIMARY KEY,
            processed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

function isTweetProcessed(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT id FROM processed_tweets WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(!!row);
        });
    });
}

function markTweetAsProcessed(id) {
    return new Promise((resolve, reject) => {
        db.run('INSERT OR IGNORE INTO processed_tweets (id) VALUES (?)', [id], (err) => {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = { initDb, isTweetProcessed, markTweetAsProcessed };
