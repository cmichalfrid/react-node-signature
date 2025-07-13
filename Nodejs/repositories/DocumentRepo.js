const fs = require('fs');
const path = require('path');

class DocumentRepo {
    constructor() {
        this.filePath = path.join(__dirname, '../data/documents.json');

        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    async getAll() {
        try {
            const data = fs.readFileSync(this.filePath, 'utf-8');
            return JSON.parse(data);
        } catch (err) {
            throw new Error('שגיאה בקריאת המסמכים: ' + err.message);
        }
    }

    async insert(document) {
        try {
            const documents = await this.getAll();
            const newId = await this.getNextDocumentId(documents);
            const newDocument = { id: newId, ...document };
            documents.push(newDocument);
            fs.writeFileSync(this.filePath, JSON.stringify(documents, null, 2));
            return newDocument;
        } catch (err) {
            throw new Error('שגיאה בשמירת המסמך: ' + err.message);
        }
    }

    async get(id) {
        const documents = await this.getAll();
        return documents.find(doc => doc.id == id) || null;
    }

    async update(id, data) {
        const documents = await this.getAll();
        const index = documents.findIndex(doc => doc.id == id);
        if (index === -1) throw new Error('Document not found');

        documents[index] = { ...documents[index], ...data };
        fs.writeFileSync(this.filePath, JSON.stringify(documents, null, 2));
        return documents[index];
    }

    async delete(id) {
        let documents = await this.getAll();
        const initialLength = documents.length;
        documents = documents.filter(doc => doc.id != id);

        if (documents.length === initialLength)
            throw new Error('Document not found');

        fs.writeFileSync(this.filePath, JSON.stringify(documents, null, 2));
    }

    async getNextDocumentId(documents = null) {
        if (!documents) {
            documents = await this.getAll();
        }
        if (documents.length === 0) return 1;
        return Math.max(...documents.map(doc => doc.id)) + 1;
    }
}

module.exports = new DocumentRepo();
