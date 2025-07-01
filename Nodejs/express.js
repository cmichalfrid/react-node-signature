require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const documentsRouter = require('./routers/document.router.js');
const cors = require('cors');
app.use(cors());
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use('/api/document', documentsRouter);
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('An error occurred, please try later...');
})
// להגדרת תיקיית build כסטטית
app.use(express.static(path.join(__dirname, 'build')));

// מסלול API לדוגמה
app.get('/api/hello', (req, res) => {
  res.json({ message: "Hello from backend!" });
});

// כל שאר הבקשות יחזירו את index.html (כדי ש־React Router יעבוד)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});