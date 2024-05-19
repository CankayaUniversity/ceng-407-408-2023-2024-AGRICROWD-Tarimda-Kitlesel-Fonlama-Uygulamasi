const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    subCategoryName: {
        type: String,
        required: true
    },
    mainCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    }
});

const CategorySchema = new Schema({
    categoryName: {
        type: String,
        required: true
    },
    requiresLocation: {
        type: Boolean,
        default: false
    }
});

const Category = mongoose.model('Category', CategorySchema);
const SubCategory = mongoose.model('SubCategory', SubCategorySchema);

module.exports = { Category, SubCategory };