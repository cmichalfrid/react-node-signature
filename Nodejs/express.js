require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

const port = process.env.PORT || 3000;

const buildPath = path.join(__dirname, 'client/build');

console.log('Checking client/build folder contents:');
try {
  const files = fs.readdirSync(buildPath);
  console.log(files);
} catch (err) {
  console.error('Error reading build folder:', err);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ░░░ 1. API routes – בהתחלה
const documentsRouter = require('./routers/document.router.js');
app.use('/api/document', documentsRouter);

// ░░░ 2. Static React build
app.use(express.static(buildPath));

// ✅ חשוב – החזרת index.html לכל נתיב שלא נמצא כדי ש-React Router יעבוד
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// ░░░ Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
