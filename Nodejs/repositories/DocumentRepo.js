const fs = require('fs');
const path = require('path');

class DocumentRepo {
    constructor() {
        // קובץ המסמכים יאוחסן בתיקיית data בתוך הפרויקט
        this.filePath = path.join(__dirname, '..', 'data', 'documents.json');
        const dirPath = path.dirname(this.filePath);

        // ודא שהתיקייה data קיימת
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // צור את הקובץ אם הוא לא קיים
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]));
        }
    }

    // החזרת כל המסמכים
    getAllDocuments() {
        const fileData = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileData);
    }

    // הוספת מסמך חדש
    addDocument(doc) {
        const docs = this.getAllDocuments();
        docs.push(doc);
        fs.writeFileSync(this.filePath, JSON.stringify(docs, null, 2));
    }

    // מציאת מסמך לפי מזהה
    getDocumentById(id) {
        const docs = this.getAllDocuments();
        return docs.find(doc => doc.id === id);
    }

    // עדכון מסמך לפי מזהה
    updateDocumentById(id, updatedData) {
        const docs = this.getAllDocuments();
        const index = docs.findIndex(doc => doc.id === id);

        if (index !== -1) {
            docs[index] = { ...docs[index], ...updatedData };
            fs.writeFileSync(this.filePath, JSON.stringify(docs, null, 2));
        }
    }
}

module.exports = new DocumentRepo();
