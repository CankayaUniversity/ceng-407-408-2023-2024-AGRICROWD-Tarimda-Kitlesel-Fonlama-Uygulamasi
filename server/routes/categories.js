const express = require('express');
const router = express.Router();
const Category = require('../models/Category');

// read
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// create new category endpoint
router.post('/', async (req, res) => {
  const category = new Category({
    categoryName: req.body.categoryName,
    subCategories: req.body.subCategories
  });

  try {
    const newCategory = await category.save();
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// update 
router.patch('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    if (req.body.categoryName !== undefined) {
      category.categoryName = req.body.categoryName;
    }
    if (req.body.subCategories !== undefined) {
      category.subCategories = req.body.subCategories;
    }
    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// delete
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Kategori bulunamadı' });
    }
    await category.remove();
    res.json({ message: 'Kategori silindi' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// initialize categories endpoint (for testing purposes)
router.post('/init', async (req, res) => {
  try {
    const categoryData = [
      {
        categoryId: 1,
        categoryName: 'Sürdürülebilir Tarım Projeleri',
        subCategories: [
          { subCategoryId: 101, subCategoryName: 'Organik tarım uygulamaları' },
          { subCategoryId: 102, subCategoryName: 'Verimliliği artıran tarım teknolojileri' }
        ]
      },
      {
        categoryId: 2,
        categoryName: 'Su Kaynakları ve Sulama Projeleri',
        subCategories: [
          { subCategoryId: 201, subCategoryName: 'Sulama sistemlerinin iyileştirilmesi' },
          { subCategoryId: 202, subCategoryName: 'Su tasarrufu sağlayan projeler' }
        ]
      },
      {
        categoryId: 3,
        categoryName: 'Tarım Teknolojisi ve İnovasyon',
        subCategories: [
          { subCategoryId: 301, subCategoryName: 'Akıllı tarım teknolojileri' },
          { subCategoryId: 302, subCategoryName: 'Tarım robotları ve otomasyon' }
        ]
      },
      {
        categoryId: 4,
        categoryName: 'Bitki Islahı ve Genetik',
        subCategories: [
          { subCategoryId: 401, subCategoryName: 'Yüksek verimli ve dirençli bitkilerin geliştirilmesi' },
          { subCategoryId: 402, subCategoryName: 'Biyoçeşitliliği koruma projeleri' }
        ]
      },
      {
        categoryId: 5,
        categoryName: 'Tarım Eğitimi ve Bilincin Artırılması',
        subCategories: [
          { subCategoryId: 501, subCategoryName: 'Çiftçilere yönelik eğitim programları' },
          { subCategoryId: 502, subCategoryName: 'Toplumda tarım bilincini artırmaya yönelik projeler' }
        ]
      },
      {
        categoryId: 6,
        categoryName: 'Yerel Tarım Girişimleri',
        subCategories: [
          { subCategoryId: 601, subCategoryName: 'Küçük ölçekli çiftçilere destek programları' },
          { subCategoryId: 602, subCategoryName: 'Yerel tarım ürünlerini tanıtma projeleri' }
        ]
      },
      {
        categoryId: 7,
        categoryName: 'İklim Değişikliği ile Başa Çıkma Projeleri',
        subCategories: [
          { subCategoryId: 701, subCategoryName: 'İklim değişikliği adaptasyonu için tarım projeleri' },
          { subCategoryId: 702, subCategoryName: 'Çevre dostu tarım uygulamalarını teşvik eden projeler' }
        ]
      },
      {
        categoryId: 8,
        categoryName: 'Tarım Ürünleri Pazarlaması',
        subCategories: [
          { subCategoryId: 801, subCategoryName: 'Yerel ürünlerin pazarlaması ve dağıtımı için destek projeler' },
          { subCategoryId: 802, subCategoryName: 'Tarım ürünlerinin daha geniş bir pazara ulaşmasını sağlayan projeler' }
        ]
      },
    ];

    const categories = await Category.insertMany(categoryData);
    res.status(201).json(categories);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// end initialize categories endpoint (for testing purposes)

module.exports = router;
