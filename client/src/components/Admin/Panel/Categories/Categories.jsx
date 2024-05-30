import React, { useState, useEffect, useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Helmet } from 'react-helmet-async';
import styles from './Categories.module.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategory, setEditCategory] = useState({ id: null, name: '' });
  const [editSubCategory, setEditSubCategory] = useState({ id: null, name: '' });
  const [newSubCategoryName, setNewSubCategoryName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [requiresLocation, setRequiresLocation] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  //Categories CRUD operations
  const fetchCategories = useCallback(async () => {
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    try {
      const response = await axios.get(
        'http://localhost:3001/api/categories/fetch-main-categories', {
        headers: {
          Authorization: `Bearer ${admToken}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });
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

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:3001/api/categories/add-new-main-category',
        {
          categoryName: newCategoryName,
          requiresLocation: requiresLocation,
        },
        {
          headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
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

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    const userConfirmation = prompt(`Type the name of the category "${categoryName}" to confirm deletion along with all its subcategories.`);
    if (userConfirmation !== categoryName) {
      alert('Category name does not match. Deletion cancelled.');
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/categories/delete-main-category/${categoryId}`,
        {
          categoryId,
          headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
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
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/edit-main-category`,
        {
          categoryId,
          categoryName: editCategory.name,
        },
        {
          headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
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

  //subcategories CRUD operations
  const fetchSubCategories = async (categoryId) => {
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:3001/api/categories/fetch-subcategories`,
        {
          params: {
            categoryId: categoryId,
          }, headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
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

  const handleAddSubCategory = async (e) => {
    e.preventDefault();
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/api/categories/add-subcategory`,
        {
          mainCategoryId: selectedCategory,
          subCategoryName: newSubCategoryName,
        },
        {
          headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
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

  const handleEditSubCategory = async (subCategoryId) => {
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      setErrorMessage('Admin token not found. Please log in.');
      setTimeout(() => setErrorMessage(''), 10000);
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:3001/api/categories/edit-sub-category`,
        {
          subCategoryId,
          subCategoryName: editSubCategory.name,
        },
        {
          headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
        }
      );
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => setSuccessMessage(''), 10000);
        fetchCategories();
        setEditSubCategory({ id: null, name: '' });
      } else {
        setErrorMessage(response.data.message);
        setTimeout(() => setErrorMessage(''), 10000);
      }
    } catch (error) {
      console.error('Error editing sub-category:', error);
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Failed to edit sub-category. Please try again.');
      }
      setTimeout(() => setErrorMessage(''), 10000);
    }
  };

  const handleDeleteSubCategory = async (subCategoryId, subCategoryName) => {
    const admToken = Cookies.get('admToken');
    if (!admToken) {
      alert("Please log in the admin panel.");
      navigate("/admin/login");
    }
    const userConfirmation = prompt(`Type the name of the category "${subCategoryName}" to confirm deletion along with all its subcategories.`);
    if (userConfirmation !== subCategoryName) {
      alert('Sub-category name does not match. Deletion cancelled.');
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:3001/api/categories/delete-sub-category/${subCategoryId}`,
        {
          headers: {
            Authorization: `Bearer ${admToken}`,
            'Content-Type': 'application/json'
          },
          withCredentials: true
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

  //useEFfect's
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  return (
    <div className={styles.pageLayout}>
      <Helmet>
        <meta charSet='utf-8' />
        <title>Categories - AGRICROWD</title>
        <link rel='canonical' href='http://localhost:3000/admin/categories' />
      </Helmet>
      {successMessage && (
        <div className={styles.successMessage}>{successMessage}</div>
      )}
      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}
      <div className={styles.container} style={{ marginBottom: '1.5rem' }}>
        <form className={styles.form} onSubmit={handleAddCategory}>
          <h2 className={styles.formTitle}>Add New Category</h2>
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

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '.5rem',
            }}
          >
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
            <span>Add</span>
          </button>
        </form>
      </div>

      {categories.length === 0 && (
        <div className={styles.message}>No categories found.</div>
      )}

      {categories.map((category) => (
        <div key={category._id} className={styles.categoryContainer}>
          <div className={styles.categoryNameDeleteContainer}>
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
                  onClick={() => {
                    handleEditCategory(category._id);
                  }}
                >
                  <img
                    src='/images/checkmark-outline.svg'
                    alt='Save Button'
                    className={styles.icon}
                    style={{ marginLeft: '0.25rem' }}
                  />
                </div>
              </div>
            ) : (
              <>
                <div className={styles.categoryNameEditContainer}>
                  <span>🏷️</span>
                  {category.categoryName} (ID: {category._id})
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
                    />
                  </div>
                </div>
                <div
                  className={styles.iconContainer}
                  onClick={() => handleDeleteCategory(category._id, category.categoryName)}
                >
                  <span style={{ fontSize: '1.5rem' }}>✖</span>
                </div>
              </>
            )}
          </div>
          <div className={styles.divider}></div>
          <div className={styles.categoryInfo}>
            <div className={styles.requireLocationAddSubCategoryContainer}>
              <div
                style={{
                  backgroundColor: category.requiresLocation
                    ? '#40c057'
                    : '#fa5252',
                  width: 'fit-content',
                  borderRadius: '100px',
                  padding: '4px 8px',
                  color: '#fff',
                }}
              >
                <span style={{ marginRight: '.25rem' }}>📍</span>
                <span>Requires Location </span>
                {category.requiresLocation ? '✔' : '✖'}
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
                />
                <span className={styles.iconLabel}>Add Subcategory</span>
              </div>
            </div>
            <div className={styles.subCategoriesContainer}>
              {subCategories[category._id] &&
                subCategories[category._id].length > 0 ? (
                subCategories[category._id].map((subCategory) => (
                  <div
                    key={subCategory._id}
                    className={styles.subCategoryContainer}
                  >
                    {editSubCategory.id === subCategory._id ? (
                      <div className={styles.editSubCategoryContainer}>
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
                        <div
                          className={styles.iconContainer}
                          onClick={() => {
                            handleEditSubCategory(subCategory._id);
                          }}
                        >
                          <img
                            src='/images/checkmark-outline.svg'
                            alt='Save Button'
                            className={styles.icon}
                            style={{ marginLeft: '0.25rem' }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.subCategoryNameDeleteContainer}>
                        <span>{subCategory.subCategoryName}</span>
                        <div className={styles.iconContainer}>
                          <img
                            src='/images/settings-outline.svg'
                            alt='Edit Button'
                            className={styles.icon}
                            onClick={() =>
                              setEditSubCategory((prevEditSubCategory) =>
                                prevEditSubCategory.id === subCategory._id
                                  ? { id: null, name: '' }
                                  : {
                                    id: subCategory._id,
                                    name: subCategory.subCategoryName,
                                  }
                              )
                            }
                          />
                        </div>
                        <div
                          className={styles.iconContainer}
                          onClick={() => handleDeleteSubCategory(subCategory._id, subCategory.subCategoryName)}
                        >
                          <span style={{ fontSize: '1.5rem' }}>✖</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className={styles.noSubCategoryMessage}>
                  No subcategories found for this category.
                </div>
              )}
            </div>
          </div>

          {selectedCategory === category._id && (
            <form className={styles.form} onSubmit={handleAddSubCategory}>
              <input
                type='text'
                value={newSubCategoryName}
                onChange={(e) => setNewSubCategoryName(e.target.value)}
                placeholder='Subcategory Name'
                className={styles.subInput}
                required
              />
              <button
                type='submit'
                style={{
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: '600',
                  padding: '5px 10px',
                }}
              >
                Add Subcategory
              </button>
            </form>
          )}
        </div>
      ))}
    </div>
  );
}

export default Categories;
