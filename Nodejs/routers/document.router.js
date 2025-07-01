const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const DocumentService = require('../services/DocumentService.js');

const upload = multer({ dest: 'uploads/' });

router.post('/', upload.single('fileName'), DocumentService.insert);
router.post('/signature', DocumentService.sendFileSignature);

router.get('/', DocumentService.getAll);
router.get('/signature/:id', DocumentService.getDocumentForId);

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const document = await DocumentService.get(id);

    if (!document) {
      return res.status(404).send('Document not found');
    }

const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
const fileUrl = `${baseUrl}/uploads/pdf/${encodeURIComponent(document.fileName)}`;

    res.json({
      id: document.id,
      name: document.name,
      email: document.email,
      fileUrl
    });

  } catch (err) {
    res.status(err.statusCode || 500).json({ error: err.message });
  }
});

module.exports = router;
