import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import styles from './Categories.module.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [requiresLocation, setRequiresLocation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get(
        'http://localhost:3001/api/categories/fetch-main-categories'
      );
      if (response.data.success) {
        setCategories(response.data.categories);
        response.data.categories.forEach((category) => {
          fetchSubCategories(category._id);
        });
      } else {
        console.error('No categories found:', response.data.message);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  }, []);

  const fetchSubCategories = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/categories/fetch-subcategories`,
        {
          params: {
            categoryId: categoryId,
          },
        }
      );
      if (response.data.success) {
        setSubCategories((prevState) => ({
          ...prevState,
          [categoryId]: response.data.subCategories,
        }));
      } else {
        setSubCategories((prevState) => ({
          ...prevState,
          [categoryId]: [],
        }));
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
      setSubCategories((prevState) => ({
        ...prevState,
        [categoryId]: [],
      }));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/api/categories/add-new-main-category',
        {
          categoryName: newCategoryName,
          requiresLocation: requiresLocation,
        }
      );
      if (response.data.success) {
        setNewCategoryName('');
        setRequiresLocation(false);
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(''), 10000);
        fetchCategories();
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(''), 10000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to add main category. Please try again.');
      }
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/categories/delete-main-category/${categoryId}`,
        {
          categoryId,
        }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(''), 10000);
        fetchCategories();
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleEditCategory = async (categoryId) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/edit-main-category`,
        {
          categoryId,
          categoryName: editCategory.name,
        }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(''), 10000);
        fetchCategories();
        setEditCategory({ id: null, name: '' });
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(''), 10000);
      }
    } catch (error) {
      console.error('Error editing category:', error);
      setErrorMessage('Failed to edit category. Please try again.');
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:3001/api/categories/add-subcategory`,
        {
          mainCategoryId: selectedCategory,
          subCategoryName: newSubCategoryName,
        }
      );
      if (response.data.success) {
        setNewSubCategoryName('');
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(''), 10000);
        fetchCategories();
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(''), 10000);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage('Failed to add sub category. Please try again.');
      }
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setEditCategory({ id: null, name: '' });
  };

  return (
    <div className={styles.pageLayout}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Categories - AGRICROWD</title>
        <link rel="canonical" href="http://localhost:3000/admin/categories" />
      </Helmet>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      <div className={styles.container}>
        <form className={styles.form} onSubmit={handleAddCategory}>
          <h2 className={styles.formTitle}>New Category</h2>
          <div className={styles.formRow}>
            <div className={styles.formRowInner}>
              <input
                type='text'
                className={styles.input}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required
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

          <button className={styles.button} type='submit'>
            Add
          </button>
        </form>
      </div>

      {categories.length === 0 && (
        <div className={styles.message}>No categories found.</div>
      )}

      {categories.map((category) => (
        <div key={category._id} className={styles.categoryContainer}>
          <div className={styles.categoryInfo}>
            {editCategory.id === category._id ? (
              <div className={styles.editCategoryContainer}>
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
                <div
                  className={styles.iconContainer}
                  onClick={() => handleEditCategory(category._id)}
                >
                  <img
                    src='/images/save-outline.svg'
                    alt='Save Button'
                    className={styles.icon}
                  ></img>
                </div>
              </div>
            ) : (
              <div>
                {category.categoryName} (ID: {category._id})
              </div>
            )}
            <div>
              Requires Location: {category.requiresLocation ? 'Yes' : 'No'}
            </div>
            <div>
              {subCategories[category._id] &&
              subCategories[category._id].length > 0 ? (
                subCategories[category._id].map((subCategory) => (
                  <div
                    key={subCategory._id}
                    className={styles.subCategoryContainer}
                  >
                    {subCategory.subCategoryName}
                  </div>
                ))
              ) : (
                <div className={styles.noSubCategoryMessage}>
                  No subcategories found for this category.
                </div>
              )}
            </div>
          </div>

          <div className={styles.btnsContainer}>
            <div
              className={styles.iconContainer}
              onClick={() => handleDeleteCategory(category._id)}
            >
              <img
                src='/images/trash-outline.svg'
                alt='Delete Button'
                className={styles.icon}
              ></img>
              <span className={styles.iconLabel}>Delete</span>
            </div>

            <div
              className={styles.iconContainer}
              onClick={() =>
                setEditCategory((prevEditCategory) =>
                  prevEditCategory.id === category._id
                    ? { id: null, name: '' }
                    : { id: category._id, name: category.categoryName }
                )
              }
            >
              <img
                src='/images/settings-outline.svg'
                alt='Edit Button'
                className={styles.icon}
              ></img>{' '}
              <span className={styles.iconLabel}>Edit</span>
            </div>

            <div
              className={styles.iconContainer}
              onClick={() =>
                setSelectedCategory((prevCategory) =>
                  prevCategory === category._id ? null : category._id
                )
              }
            >
              <img
                src='/images/add-outline.svg'
                alt='Add Button'
                className={styles.icon}
              ></img>
              <span className={styles.iconLabel}>Add Subcategory</span>
            </div>

            {selectedCategory === category._id && (
              <form className={styles.form} onSubmit={handleAddSubCategory}>
                <input
                  type='text'
                  value={newSubCategoryName}
                  onChange={(e) => setNewSubCategoryName(e.target.value)}
                  placeholder='Subcategory Name'
                  required
                />
                <button type='submit'>
                  <img
                    src='/images/save-outline.svg'
                    alt='Save Button'
                    className={styles.icon}
                  ></img>
                </button>
              </form>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Categories;
