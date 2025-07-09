const autoBind = require('auto-bind');
const Database = require('better-sqlite3');
const path = require('path');

class Repository {
    constructor(model) {
        this.model = model;
        this.db = new Database(path.join(__dirname, '../data/database.db'));

        this.db.prepare(`
            CREATE TABLE IF NOT EXISTS documents (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                fileData TEXT NOT NULL,
                signedFileData TEXT
            )
        `).run();

        autoBind(this);
    }

    async getAll(query) {
        try {
            const stmt = this.db.prepare('SELECT * FROM documents');
            return stmt.all();
        } catch (err) {
            throw new Error('שגיאה בקריאת המסמכים: ' + err.message);
        }
    }

    async get(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM documents WHERE id = ?');
            return stmt.get(id) || null;
        } catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async update(id, data) {
        try {
            const existing = this.db.prepare('SELECT * FROM documents WHERE id = ?').get(id);
            if (!existing) throw new Error('Document not found');

            const updated = { ...existing, ...data };

            this.db.prepare(`
                UPDATE documents
                SET name = ?, email = ?, fileData = ?, signedFileData = ?
                WHERE id = ?
            `).run(updated.name, updated.email, updated.fileData, updated.signedFileData, id);

            return updated;
        } catch (err) {
            throw new Error('Error updating document: ' + err.message);
        }
    }

    async delete(id) {
        try {
            const stmt = this.db.prepare('DELETE FROM documents WHERE id = ?');
            const result = stmt.run(id);

            if (result.changes === 0) {
                const error = new Error('Item not found');
                error.statusCode = 404;
                throw error;
            }
        } catch (errors) {
            throw errors;
        }
    }
}

module.exports = Repository;
