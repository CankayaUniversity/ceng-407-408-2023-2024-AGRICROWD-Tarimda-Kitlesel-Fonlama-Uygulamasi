const express = require('express');
const router = express.Router();
const { Category, SubCategory } = require('../models/Categories');

//mainCategories
router.get('/fetch-main-categories', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, categories });
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/add-new-main-category', async (req, res) => {
    try {
        const { categoryName, requiresLocation } = req.body;
        
        const existingCategory = await Category.findOne({ categoryName });
        if (existingCategory) {
            return res.status(400).json({ success: false, message: 'Category with the same name already exists' });
        }

        const newCategory = new Category({
            categoryName,
            requiresLocation,
        });
        await newCategory.save();
        res.status(200).json({ success: true, message: 'Category added successfully!' });
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/edit-main-category', async (req, res) => {
    try {
        const { categoryName, categoryId } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { categoryName }, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/delete-main-category/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        await Category.findByIdAndDelete(categoryId);
        res.json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error', message: "Please contact with admin" });
    }
});


//Subcategories
router.post('/add-subcategory', async (req, res) => {
    try {
        const { mainCategoryId, subCategoryName } = req.body;
        console.log(mainCategoryId, subCategoryName);

        const existingSubCategory = await SubCategory.findOne({ subCategoryName, mainCategory: mainCategoryId });
        if (existingSubCategory) {
            return res.status(400).json({ success: false, message: 'Sub category with the same name already exists in this main category' });
        }

        const category = await Category.findById(mainCategoryId);
        if (!category) {
            return res.status(404).json({ success: false, message: 'Main category not found' });
        }

        const newSubCategory = new SubCategory({
            subCategoryName,
            mainCategory: mainCategoryId,
        });
        await newSubCategory.save();
        res.json({ success: true, message: 'Sub category added successfully' });
    } catch (error) {
        console.error('Error adding sub category:', error);
        res.status(500).json({ success: false, message: 'Failed to add sub category' });
    }
});

router.get('/fetch-subcategories', async (req, res) => {
    try {
        const { categoryId } = req.query;
        const subCategories = await SubCategory.find({ mainCategory: categoryId });
        if (subCategories.length === 0) {
            return res.json({ success: false, message: 'No subcategories found for this category' });
        }
        res.status(200).json({ success: true, subCategories });
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


//fetch-both

router.get('/fetch-both', async (req, res) => {
    try {
        const mainCategories = await Category.find();
        const categoriesWithSubCategories = await Promise.all(
            mainCategories.map(async (category) => {
                const subCategories = await SubCategory.find({ mainCategory: category._id });
                return { ...category.toObject(), subCategories };
            })
        );
        res.status(200).json({ success: true, categoriesWithSubCategories });
    } catch (error) {
        console.error('Error fetching main and sub categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




module.exports = router;
