import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCategoryModal from '../../../Modal/Modal';
import styles from './Categories.module.css';

function CategoriesCrud() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  const [editSubCategory, setEditSubCategory] = useState({
    id: null,
    name: '',
  });
  const [requiresLocation, setRequiresLocation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        'http://localhost:3001/api/categories',
        {
          categoryName: newCategoryName,
          requiresLocation: requiresLocation,
          isMainCategory: true,
        }
      );
      setNewCategoryName('');
      setRequiresLocation(false);
      fetchCategories();
      setSuccessMessage('Category added successfully!');
      setTimeout(() => setSuccessMessage(''), 10000);
    } catch (error) {
      console.error('Error adding category:', error);
      setErrorMessage('Failed to add category. Please try again.');
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleAddSubCategory = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3001/api/categories/${selectedCategory._id}/subcategories`,
        {
          subCategoryName: newSubCategoryName,
        }
      );
      setNewSubCategoryName('');
      fetchCategories();
      setSuccessMessage('Subcategory added successfully!');
      setTimeout(() => setSuccessMessage(''), 10000);
    } catch (error) {
      console.error('Error adding subcategory:', error);
      setErrorMessage('Failed to add subcategory. Please try again.');
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/categories/${categoryId}`
      );
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleDeleteSubCategory = async (categoryId, subCategoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/categories/${categoryId}/subcategories/${subCategoryId}`
      );
      fetchCategories();
    } catch (error) {
      console.error('Error deleting subcategory:', error);
    }
  };

  const handleEditCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/${categoryId}`,
        {
          categoryName: editCategory.name,
        }
      );
      fetchCategories();
      setEditCategory({ id: null, name: '' });
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleEditSubCategory = async (categoryId, subCategoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/${categoryId}/subcategories/${subCategoryId}`,
        {
          subCategoryName: editSubCategory.name,
        }
      );
      fetchCategories();
      setEditSubCategory({ id: null, name: '' });
    } catch (error) {
      console.error('Error editing subcategory:', error);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.pageLayout}>
      <button onClick={openModal}>Modalı Aç</button>
      <AddCategoryModal isOpen={isModalOpen} onClose={closeModal}>
        <h2>Modal İçeriği</h2>
        <p>Buraya istediğiniz içeriği koyabilirsiniz.</p>
      </AddCategoryModal>

      <div className={styles.container}>
        <form className={styles.form}>
          <h2 className={styles.formTitle}>New Category</h2>
          {successMessage && <div variant='success'>{successMessage}</div>}
          {errorMessage && <div variant='danger'>{errorMessage}</div>}

          <div className={styles.formRow}>
            <div className={styles.formRowInner}>
              <input
                type='text'
                className={styles.input}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
              <label className={styles.label}>Category Name</label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <label style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type='checkbox'
                checked={requiresLocation}
                onChange={(e) => setRequiresLocation(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Requires Location
            </label>
          </div>

          <button className={styles.button} onClick={handleAddCategory}>
            Add
          </button>
        </form>
      </div>

      <div className={styles.container}>
        {categories.map((category) => (
          <div key={category._id} className={styles.categoryContainer}>
            <div>
              {category.categoryName} (ID: {category._id})
            </div>

            <div className={styles.btnsContainer}>
              <button
                className={styles.button}
                onClick={() => handleDeleteCategory(category._id)}
              >
                Delete
              </button>

              <button
                className={styles.button}
                onClick={() =>
                  setEditCategory({
                    id: category._id,
                    name: category.categoryName,
                  })
                }
              >
                Edit
              </button>

              {editCategory.id === category._id && (
                <div className='mt-2'>
                  <input
                    type='text'
                    value={editCategory.name}
                    onChange={(e) =>
                      setEditCategory({
                        ...editCategory,
                        name: e.target.value,
                      })
                    }
                    placeholder='New Category Name'
                  />

                  <button
                    className={styles.button}
                    onClick={() => handleEditCategory(category._id)}
                  >
                    Save
                  </button>
                </div>
              )}

              <button
                className={styles.button}
                onClick={() => setSelectedCategory(category)}
              >
                Add Subcategory
              </button>
            </div>

            {selectedCategory && selectedCategory._id === category._id && (
              <div className='mt-2'>
                <input
                  type='text'
                  placeholder='Enter Subcategory Name'
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                />

                <button
                  variant='success'
                  className='mt-2'
                  onClick={handleAddSubCategory}
                >
                  Add
                </button>
              </div>
            )}

            {category.subCategories.map((subCategory) => (
              <li key={subCategory._id}>
                {subCategory.subCategoryName} (ID: {subCategory._id})
                <div>
                  <button
                    variant='danger'
                    onClick={() =>
                      handleDeleteSubCategory(category._id, subCategory._id)
                    }
                  >
                    Delete
                  </button>

                  <button
                    variant='info'
                    onClick={() =>
                      setEditSubCategory({
                        id: subCategory._id,
                        name: subCategory.subCategoryName,
                      })
                    }
                  >
                    Edit
                  </button>

                  {editSubCategory.id === subCategory._id && (
                    <div className='mt-2'>
                      <input
                        type='text'
                        value={editSubCategory.name}
                        onChange={(e) =>
                          setEditSubCategory({
                            ...editSubCategory,
                            name: e.target.value,
                          })
                        }
                        placeholder='New Subcategory Name'
                      />

                      <button
                        variant='primary'
                        className='mt-2'
                        onClick={() =>
                          handleEditSubCategory(category._id, subCategory._id)
                        }
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoriesCrud;
