import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddCategoryModal from '../../../Modal/Modal';
import styles from './Categories.module.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
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
  };

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
        //console.error('No subcategories found:', response.data.message);
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

  const handleAddCategory = async () => {
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
      }
    } catch (error) {
      console.error('Error adding category:', error);
      setErrorMessage('Failed to add category. Please try again.');
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
      fetchCategories();
      setEditCategory({ id: null, name: '' });
    } catch (error) {
      console.error('Error editing category:', error);
    }
  };

  const handleAddSubCategory = async () => {
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
      }
    } catch (error) {
      console.error('Error adding sub category:', error);
      setErrorMessage('Failed to add sub category. Please try again.');
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className={styles.pageLayout}>
      {successMessage && <div variant='success'>{successMessage}</div>}
      {errorMessage && <div variant='danger'>{errorMessage}</div>}
      <div className={styles.container}>
        <form className={styles.form}>
          <h2 className={styles.formTitle}>New Category</h2>
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

      {categories.length === 0 && (
        <div className={styles.message}>No categories found.</div>
      )}

      {categories.map((category) => (
        <div key={category._id} className={styles.categoryContainer}>
          <div>
            {category.categoryName} (ID: {category._id})
          </div>
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
              onClick={() =>
                setSelectedCategory((prevCategory) =>
                  prevCategory === category._id ? null : category._id
                )
              }
            >
              Add Subcategory
            </button>
            {selectedCategory === category._id && (
              <form className={styles.form}>
                <h2 className={styles.formTitle}>New Subcategory</h2>
                <div className={styles.formRow}>
                  <div className={styles.formRowInner}>
                    <input
                      type='text'
                      className={styles.input}
                      value={newSubCategoryName}
                      onChange={(e) => setNewSubCategoryName(e.target.value)}
                    />
                    <label className={styles.label}>Subcategory Name</label>
                  </div>
                </div>

                <button
                  className={styles.button}
                  onClick={handleAddSubCategory}
                >
                  Add
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
