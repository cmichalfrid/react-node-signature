const fs = require('fs');
const Repository = require('./Repository.js');
const Document = require('../models/document.model.js');
const path = require('path'); // ← הוספה חשובה

class DocumentRepo extends Repository {
    constructor() {
        super(Document);
        this.filePath = path.join(__dirname, '../data/documents.json');

    }

    async getAll() {
        try {
            if (!fs.existsSync(this.filePath)) return [];
            const content = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(content);
        } catch (err) {
            throw new Error('שגיאה בקריאת המסמכים: ' + err.message);
        }
    }

    async insert(data) {
        try {
            let allDocuments = [];

            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8');
                try {
                    const parsed = JSON.parse(content);
                    allDocuments = Array.isArray(parsed) ? parsed : [];
                } catch {
                    allDocuments = [];
                }
            }

            const newId = await this.getNextDocumentId(allDocuments);
            const newFile = { ...data, id: newId };
            allDocuments.push(newFile);

            fs.writeFileSync(this.filePath, JSON.stringify(allDocuments, null, 2));

            return newFile.id;
        } catch (err) {
            throw new Error('שגיאה בשמירת המסמך: ' + err.message);
        }
    }

    async getNextDocumentId(allDocuments) {
        try {
            if (allDocuments.length === 0) return 1;

            const ids = allDocuments
                .map(doc => doc.id)
                .filter(id => typeof id === 'number');

            if (ids.length === 0) return 1;

            return Math.max(...ids) + 1;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new DocumentRepo();
