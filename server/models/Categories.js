const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const subCategorySchema = new Schema({
    subCategoryName: {
        type: String,
        required: true
    }
});

const categorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    requiresLocation: {
        type: Boolean,
        default: false
    },
    isMainCategory: {
        type: Boolean,
        default: true
    },
    subCategories: [subCategorySchema]
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
