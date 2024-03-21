const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: Number,
    required: true,
    unique: true
  },
  categoryName: {
    type: String,
    required: true,
    unique: true
  },
  subCategories: {
    type: [{
      subCategoryId: {
        type: Number,
        required: true,
        unique: true
      },
      subCategoryName: {
        type: String,
        required: true
      }
    }],
    required: true
  }
}, { _id: false });

module.exports = mongoose.model('Category', categorySchema);
