const express = require('express');
const router = express.Router();
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const path = require('path');
const Photo = require('../models/PhotoModel');

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  keyFilename: './keys/bucketKey.json'
});
const bucketName = 'agricrowd_storage';
const bucket = storage.bucket(bucketName);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // Max file size: 10MB
  }
});

/**
 * @swagger
 * tags:
 *   name: Photos API's
 *   description: Endpoints for managing photos
 */

/**
 * @swagger
 * /upload:
 *   post:
 *     tags:
 *       - Photos API's
 *     summary: Upload photos
 *     description: Upload up to 10 photos with a maximum size of 10MB each.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Photos uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: 60c72b2f5f1b2c001f6e4b3c
 *                   url:
 *                     type: string
 *                     example: https://storage.googleapis.com/agricrowd_storage/1623919241763-123456789.jpg
 *       400:
 *         description: No files uploaded
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hiçbir dosya yüklenmedi.
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/upload', upload.array('photos', 10), async (req, res) => {
  try {
    const files = req.files;

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
        return res.status(500).json({ message: 'Internal Server Error' });
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

/**
 * @swagger
 * /{photoId}:
 *   get:
 *     tags:
 *       - Photos API's
 *     summary: Get photo by ID
 *     description: Retrieve a photo's information by its ID.
 *     parameters:
 *       - in: path
 *         name: photoId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the photo to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved photo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 photo:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 60c72b2f5f1b2c001f6e4b3c
 *                     url:
 *                       type: string
 *                       example: https://storage.googleapis.com/agricrowd_storage/1623919241763-123456789.jpg
 *                 url:
 *                   type: string
 *                   example: https://storage.googleapis.com/agricrowd_storage/1623919241763-123456789.jpg
 *       404:
 *         description: Photo not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Photo not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get('/:photoId', async (req, res) => {
  const { photoId } = req.params;
  try {
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    res.status(200).json({success:true, photo:photo, url: photo.url});
  } catch (error) {
    console.error('Error fetching photo:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
