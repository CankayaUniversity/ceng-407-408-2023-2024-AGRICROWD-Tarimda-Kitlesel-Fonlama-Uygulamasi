const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const Photo = require('../models/PhotoModel');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: './keys/bucketKey.json' // Servis anahtarınıza göre değiştirin
});
const bucketName = 'agricrowd_storage';
const bucket = storage.bucket(bucketName);

router.post('/upload', async (req, res) => {
  try {
    const files = req.files;
    console.log("fotograflarin durumu: ",files);

    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'Hiçbir dosya yüklenmedi.' });
    }

    const savedPhotos = [];

    for (const file of files) {
      const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
      const blob = bucket.file(fileName);
      const blobStream = blob.createWriteStream({
        resumable: false,
        gzip: true
      });

      blobStream.on('error', (err) => {
        console.error('Error uploading photo:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      });

      blobStream.on('finish', async () => {
        const photoUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
        
        const savedPhoto = await Photo.create({ url: photoUrl });
        savedPhotos.push(savedPhoto);

        if (savedPhotos.length === files.length) {
          res.status(201).json(savedPhotos);
        }
      });

      blobStream.end(file.buffer);
    }
  } catch (err) {
    console.error('Error uploading photos:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Fotoğrafı almak için endpoint
router.get('/:photoId', async (req, res) => {
  const { photoId } = req.params;
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.status(201).json({success:true, photo:photo, url: photo.url});
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
