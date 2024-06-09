const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  filename: { type: String },
  originalname: { type: String  },
  path: { type: String },
  mimetype: { type: String},
  url: {type: String, required:true},
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
