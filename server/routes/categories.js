const express = require('express');
const router = express.Router();
const Category = require('../models/Categories');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { categoryName, requiresLocation, isMainCategory } = req.body;
        const newCategory = new Category({
            categoryName,
            requiresLocation,
            isMainCategory
        });
        const savedCategory = await newCategory.save();
        res.json(savedCategory);
    } catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:categoryId', async (req, res) => {
    try {
        const { categoryName } = req.body;
        const categoryId = req.params.categoryId;
        const updatedCategory = await Category.findByIdAndUpdate(categoryId, { categoryName }, { new: true });
        res.json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:categoryId', async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        await Category.findByIdAndDelete(categoryId);
        res.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/:categoryId/subcategories', async (req, res) => {
    try {
        const { subCategoryName } = req.body;
        const categoryId = req.params.categoryId;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        category.subCategories.push({ subCategoryName });
        await category.save();
        res.json(category);
    } catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:categoryId/subcategories/:subCategoryId', async (req, res) => {
    try {
        const { subCategoryName } = req.body;
        const { categoryId, subCategoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        const subCategory = category.subCategories.id(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }
        subCategory.subCategoryName = subCategoryName;
        await category.save();
        res.json(category);
    } catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.delete('/:categoryId/subcategories/:subCategoryId', async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params;
        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        category.subCategories.pull({ _id: subCategoryId });
        await category.save();
        res.json(category);
    } catch (error) {
        console.error('Error deleting subcategory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
