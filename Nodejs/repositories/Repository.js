const autoBind = require('auto-bind');
const { filePath } = require('./DocumentRepo');
const { json } = require('express');
const fs = require('fs');

class Repository {
    constructor(model) {
        this.model = model;
        this.filePath = './data/documents.json';
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

    async insert(data) {
        try {
            const item = await this.model.create(data);
            if (item) {
                return item;
            }
            throw new Error('Something wrong happened');
        } catch (error) {
            throw error;
        }
    }

    async update(id, data) {
        try {
            const item = await this.model.findByIdAndUpdate(id, data, { 'new': true });
           // return new HttpResponse(item);
        } catch (errors) {
            throw errors;
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
