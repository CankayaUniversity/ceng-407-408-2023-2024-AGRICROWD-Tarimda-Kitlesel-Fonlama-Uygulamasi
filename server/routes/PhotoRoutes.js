const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/PhotoModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.post('/upload', upload.array('photos', 5), async (req, res) => {
  try {
    const photos = req.files.map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    }));
    
    const savedPhotos = await Photo.insertMany(photos);

    res.status(201).json(savedPhotos);
  } catch (err) {
    console.error('Error uploading photos:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:photoId', async (req, res) => {
  const { photoId } = req.params;
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.sendFile(path.resolve(photo.path));
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
