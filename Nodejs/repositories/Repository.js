const autoBind = require('auto-bind');
const { filePath } = require('./DocumentRepo');
const { json } = require('express');
const fs = require('fs');

class Repository {
    constructor(model) {
        this.model = model;
        this.filePath = path.join(__dirname, '../data/documents.json');
        autoBind(this);
    }

    async getAll(query) {
        try {
            if (!fs.existsSync(this.filePath)) return [];
            const content = fs.readFileSync(this.filePath, 'utf8');
            return JSON.parse(content);
        } catch (err) {
            throw new Error('שגיאה בקריאת המסמכים: ' + err.message);
        }
    }

    async get(id) {
        try {
            if (!fs.existsSync(this.filePath)) return null;

            const content = fs.readFileSync(this.filePath)
            const allDocuments = JSON.parse(content)
            console.log('Looking for id:', id);
            console.log('All documents:', allDocuments);
            const findDocumentId = allDocuments.find(a => a.id === Number(id))
            return findDocumentId || null;
        }
        catch (error) {
            throw new Error(`Database error: ${error.message}`);
        }
    }

    async update(id, data) {
    try {
        if (!fs.existsSync(this.filePath)) throw new Error('File not found');

        const content = fs.readFileSync(this.filePath, 'utf8');
        let allDocuments = JSON.parse(content);

        const index = allDocuments.findIndex(doc => doc.id === Number(id));
        if (index === -1) throw new Error('Document not found');

        allDocuments[index] = { ...allDocuments[index], ...data };

        fs.writeFileSync(this.filePath, JSON.stringify(allDocuments, null, 2));
        return allDocuments[index];
    } catch (err) {
        throw new Error('Error updating document: ' + err.message);
    }
}

    async delete(id) {
        try {
            const item = await this.model.findByIdAndDelete(id);
            if (!item) {
                const error = new Error('Item not found');
                error.statusCode = 404;
                throw error;
            } else {
              //  return new HttpResponse(item, { 'deleted': true });
            }
        } catch (errors) {
            throw errors;
        }
    }
}
module.exports = Repository;
