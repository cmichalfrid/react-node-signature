require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const documentsRouter = require('./routers/document.router.js');
const cors = require('cors');
app.use(cors());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
console.log('Starting to setup routes');
app.use('/api/document', documentsRouter);
console.log('Finished setting up /api/document route');app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('An error occurred, please try later...');
})
app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on port ${port}`);
});