require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const buildPath = path.join(__dirname, 'build');

console.log('📦 Checking build folder contents:');
try {
  const files = fs.readdirSync(buildPath);
  console.log(files);
  if (!files.includes('index.html')) {
    console.error('❌ index.html not found in buildPath:', buildPath);
  } else {
    console.log('✅ index.html found in', buildPath);
  }
} catch (err) {
  console.error('❌ Error reading build folder:', err);
}

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 1. API routes
const documentsRouter = require('./routers/document.router.js');
app.use('/api/document', documentsRouter);

// 2. Static React build - חשוב: לבדוק שהקבצים קיימים
app.use(express.static(buildPath, {
  fallthrough: false, // אם קובץ לא נמצא, יחזיר 404 ולא ימשיך הלאה ל-get('*')
}));

// 3. אם הבקשה לא התאימה לאף קובץ סטטי ו/או API, מחזירים index.html (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'), (err) => {
    if (err) {
      console.error('Error sending index.html:', err);
      res.status(500).send(err);
    }
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server listening on port ${port}`);
});
