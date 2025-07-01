require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const host = process.env.HOST;
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

app.listen(port, () => {
    console.log(`express server is running at http://${host}:${port}`);
});