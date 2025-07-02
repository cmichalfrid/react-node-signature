require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const documentsRouter = require('./routers/document.router.js');

const app = express();
const port = process.env.PORT || 3000;

// ▓ Middleware בסיסי
app.use(cors());
app.use(express.json());

// ▓ Static for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ▓ Log כל בקשה
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// ▓ API routes - חשוב לפני ה־React
console.log('Starting to setup routes');
app.use('/api/document', documentsRouter);
console.log('Finished setting up /api/document route');

// ▓ Error handler - תמיד בסוף ה־API
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('An error occurred, please try later...');
});

// ▓ Static React build - רק אחרי ה־API
app.use(express.static(path.join(__dirname, 'build')));

// ▓ Fallback to index.html - רק אחרי כל השאר
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ▓ Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on port ${port}`);
});
