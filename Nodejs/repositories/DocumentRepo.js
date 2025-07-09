const path = require('path');
const Database = require('better-sqlite3');
const Repository = require('./Repository.js');
const Document = require('../models/document.model.js');

class DocumentRepo extends Repository {
    constructor() {
        super(Document);
        const dbPath = path.join(__dirname, '../data/database.db');
        this.db = new Database(dbPath);

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                fileData TEXT NOT NULL,
                signedFileData TEXT
            )
        `).run();
    }

    async getAll() {
        try {
            const stmt = this.db.prepare('SELECT * FROM documents');
            return stmt.all();
        } catch (err) {
            throw new Error('שגיאה בקריאת המסמכים: ' + err.message);
        }
    }

    async insert(data) {
        try {
            const stmt = this.db.prepare(
                'INSERT INTO documents (name, email, fileData) VALUES (?, ?, ?)'
            );
            const result = stmt.run(data.name, data.email, data.fileData);
            return result.lastInsertRowid;
        } catch (err) {
            throw new Error('שגיאה בשמירת המסמך: ' + err.message);
        }
    }

    async getNextDocumentId() {
        try {
            const stmt = this.db.prepare('SELECT MAX(id) as maxId FROM documents');
            const row = stmt.get();
            return row.maxId ? row.maxId + 1 : 1;
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new DocumentRepo();
