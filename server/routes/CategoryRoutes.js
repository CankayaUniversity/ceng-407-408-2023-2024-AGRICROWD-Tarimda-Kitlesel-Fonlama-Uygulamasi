const express = require('express');
const axios = require('axios');
const router = express.Router();
const { Category, SubCategory } = require('../models/Categories');

/**
 * @swagger
 * tags:
 *   name: Category API's
 *   description: Endpoints for managing categories
 */

//middleware
const verifyAdminToken = async (req,res,next) => {
    const admToken = req.headers.authorization;
    if(!admToken || !admToken.startsWith('Bearer ')){
        return res.status(401).json({success:false, message:'Unauthorized'});
    }

    try {
        const response = await axios.post(
            `${process.env.REACT_APP_BASE_API_URL}/api/admin/verify-token`,
            {},
            {
                headers: {
                    Authorization: admToken,
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            }
        );
        if(response.data.success){
            next();
        } else {
            res.status(403).json({success:false, message:'There is no admin!'});
        }
    } catch(error) {
        console.error("endpoint error ",error)
        res.status(500).json({success:false, message:'Internal server error'});
    }
};

/**
 * @swagger
 * /api/categories/fetch-main-categories:
 *   get:
 *     summary: Fetch main categories
 *     description: Retrieves a list of main categories.
 *     responses:
 *       200:
 *         description: A list of main categories
 *       500:
 *         description: Internal Server Error
 */

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
/**
 * @swagger
 * /api/categories/add-new-main-category:
 *   post:
 *     summary: Add new main category
 *     description: Adds a new main category.
 *     parameters:
 *       - in: body
 *         name: category
 *         description: The category object to add
 *         schema:
 *           type: object
 *           required:
 *             - categoryName
 *             - requiresLocation
 *           properties:
 *             categoryName:
 *               type: string
 *             requiresLocation:
 *               type: boolean
 *     responses:
 *       200:
 *         description: Category added successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post('/add-new-main-category', verifyAdminToken,async (req, res) => {
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
/**
 * @swagger
 * /api/categories/edit-main-category:
 *   put:
 *     summary: Edit main category
 *     description: Updates an existing main category.
 *     parameters:
 *       - in: body
 *         name: category
 *         description: The category object to update
 *         schema:
 *           type: object
 *           required:
 *             - categoryId
 *             - categoryName
 *           properties:
 *             categoryId:
 *               type: string
 *             categoryName:
 *               type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Category not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/edit-main-category', verifyAdminToken,async (req, res) => {
    try {
        const { categoryName, categoryId } = req.body;
        if (!categoryName || !categoryId) {
            return res.status(400).json({ error: 'categoryName and categoryId are required' });
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            { categoryName },
            { new: true, runValidators: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json({
            message: 'Category updated successfully',
            updatedCategory,
        });
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/categories/delete-main-category/{categoryId}:
 *   delete:
 *     summary: Delete main category
 *     description: Deletes a main category and its subcategories.
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the main category to delete
 *     responses:
 *       200:
 *         description: Category and its subcategories deleted successfully
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete-main-category/:categoryId', verifyAdminToken,async (req, res) => {
    try {
        const categoryId = req.params.categoryId;

        await SubCategory.deleteMany({ mainCategory: categoryId });
        await Category.findByIdAndDelete(categoryId);

        res.json({ success: true, message: 'Category and its subcategories deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Internal Server Error', message: 'Please contact with admin' });
    }
});


//Subcategories
/**
 * @swagger
 * /api/categories/add-subcategory:
 *   post:
 *     summary: Add subcategory
 *     description: Adds a new subcategory to an existing main category.
 *     parameters:
 *       - in: body
 *         name: subcategory
 *         description: The subcategory object to add
 *         schema:
 *           type: object
 *           required:
 *             - mainCategoryId
 *             - subCategoryName
 *           properties:
 *             mainCategoryId:
 *               type: string
 *             subCategoryName:
 *               type: string
 *     responses:
 *       200:
 *         description: Subcategory added successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Main category not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/add-subcategory', verifyAdminToken,async (req, res) => {
    try {
        const { mainCategoryId, subCategoryName } = req.body;
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
/**
 * @swagger
 * /api/categories/fetch-subcategories:
 *   get:
 *     summary: Fetch subcategories
 *     description: Retrieves all subcategories for a given main category.
 *     parameters:
 *       - in: query
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the main category to fetch subcategories for
 *     responses:
 *       200:
 *         description: Subcategories retrieved successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: No subcategories found for the given category
 *       500:
 *         description: Internal Server Error
 */
router.get('/fetch-subcategories',async (req, res) => {
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
/**
 * @swagger
 * /api/categories/edit-sub-category:
 *   put:
 *     summary: Edit subcategory
 *     description: Updates an existing subcategory.
 *     parameters:
 *       - in: body
 *         name: subcategory
 *         description: The subcategory object to update
 *         schema:
 *           type: object
 *           required:
 *             - subCategoryId
 *             - subCategoryName
 *           properties:
 *             subCategoryId:
 *               type: string
 *             subCategoryName:
 *               type: string
 *     responses:
 *       200:
 *         description: Subcategory updated successfully
 *       400:
 *         description: Bad Request
 *       404:
 *         description: Subcategory not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/edit-sub-category', verifyAdminToken,async (req, res) => {
    try {
        const { subCategoryName, subCategoryId } = req.body;

        if (!subCategoryName || !subCategoryId) {
            return res.status(400).json({ error: 'subCategoryName and subCategoryId are required' });
        }

        const existingSubCategory = await SubCategory.findOne({
            subCategoryName,
            _id: { $ne: subCategoryId }
        });

        if (existingSubCategory) {
            return res.status(400).json({ error: 'Subcategory with this name already exists' });
        }

        const updatedCategory = await SubCategory.findByIdAndUpdate(
            subCategoryId,
            { subCategoryName },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Subcategory not found' });
        }

        res.json({
            message: 'Subcategory updated successfully',
            updatedCategory,
        });
    } catch (error) {
        console.error('Error updating subcategory:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/**
 * @swagger
 * /api/categories/delete-sub-category/{subCategoryId}:
 *   delete:
 *     summary: Delete subcategory
 *     description: Deletes a subcategory.
 *     parameters:
 *       - in: path
 *         name: subCategoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the subcategory to delete
 *     responses:
 *       200:
 *         description: Subcategory deleted successfully
 *       500:
 *         description: Internal Server Error
 */
router.delete('/delete-sub-category/:subCategoryId', verifyAdminToken,async (req, res) => {
    try {
        const subCategoryId = req.params.subCategoryId;
        await SubCategory.findByIdAndDelete(subCategoryId);
        res.json({ success: true, message: 'Sub category deleted successfully' });
    } catch (error) {
        console.error('Error deleting sub-category:', error);
        res.status(500).json({ error: 'Internal Server Error', message: "Please contact with server admin" });
    }
});




//fetch-both
/**
 * @swagger
 * /fetch-both:
 *   get:
 *     summary: Fetch both main and sub categories
 *     description: Retrieves all main categories along with their subcategories.
 *     responses:
 *       200:
 *         description: Main and sub categories retrieved successfully
 *       500:
 *         description: Internal Server Error
 */
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
