import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Form, Card, Alert } from 'react-bootstrap';

function CategoriesCrud() {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [editCategory, setEditCategory] = useState({ id: null, name: '' });
    const [editSubCategory, setEditSubCategory] = useState({ id: null, name: '' });
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
            const response = await axios.post('http://localhost:3001/api/categories', {
                categoryName: newCategoryName,
                requiresLocation: requiresLocation,
                isMainCategory: true
            });
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
            const response = await axios.post(`http://localhost:3001/api/categories/${selectedCategory._id}/subcategories`, {
                subCategoryName: newSubCategoryName
            });
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
            const response = await axios.delete(`http://localhost:3001/api/categories/${categoryId}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleDeleteSubCategory = async (categoryId, subCategoryId) => {
        try {
            const response = await axios.delete(`http://localhost:3001/api/categories/${categoryId}/subcategories/${subCategoryId}`);
            fetchCategories();
        } catch (error) {
            console.error('Error deleting subcategory:', error);
        }
    };

    const handleEditCategory = async (categoryId) => {
        try {
            const response = await axios.put(`http://localhost:3001/api/categories/${categoryId}`, {
                categoryName: editCategory.name
            });
            fetchCategories();
            setEditCategory({ id: null, name: '' }); 
        } catch (error) {
            console.error('Error editing category:', error);
        }
    };

    const handleEditSubCategory = async (categoryId, subCategoryId) => {
        try {
            const response = await axios.put(`http://localhost:3001/api/categories/${categoryId}/subcategories/${subCategoryId}`, {
                subCategoryName: editSubCategory.name
            });
            fetchCategories();
            setEditSubCategory({ id: null, name: '' }); 
        } catch (error) {
            console.error('Error editing subcategory:', error);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    return (
        <div className="container">
            <h2>Categories</h2>
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Form>
                <Form.Group controlId="formCategoryName">
                    <Form.Label>Add New Category</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter Category Name"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                    />
                    <Form.Check
                        type="checkbox"
                        label="Requires Location"
                        checked={requiresLocation}
                        onChange={(e) => setRequiresLocation(e.target.checked)}
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleAddCategory}>
                    Add
                </Button>
            </Form>

            <div className="row">
                {categories.map((category) => (
                    <div key={category._id} className="col-md-6 mt-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{category.categoryName} (ID: {category._id})</Card.Title>
                                <Button variant="danger" onClick={() => handleDeleteCategory(category._id)}>Delete</Button>
                                <Button variant="info" onClick={() => setEditCategory({ id: category._id, name: category.categoryName })}>Edit</Button>
                                {editCategory.id === category._id &&
                                    <div className="mt-2">
                                        <Form.Control
                                            type="text"
                                            value={editCategory.name}
                                            onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                                            placeholder="New Category Name"
                                        />
                                        <Button variant="primary" className="mt-2" onClick={() => handleEditCategory(category._id)}>Save</Button>
                                    </div>
                                }
                                <Button variant="success" className="mt-2" onClick={() => setSelectedCategory(category)}>Add Subcategory</Button>
                                {selectedCategory && selectedCategory._id === category._id &&
                                    <div className="mt-2">
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Subcategory Name"
                                            value={newSubCategoryName}
                                            onChange={(e) => setNewSubCategoryName(e.target.value)}
                                        />
                                        <Button variant="success" className="mt-2" onClick={handleAddSubCategory}>Add</Button>
                                    </div>
                                }
                                <ul className="list-group mt-2">
                                    {category.subCategories.map((subCategory) => (
                                        <li key={subCategory._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {subCategory.subCategoryName} (ID: {subCategory._id})
                                            <div>
                                                <Button variant="danger" onClick={() => handleDeleteSubCategory(category._id, subCategory._id)}>Delete</Button>
                                                <Button variant="info" onClick={() => setEditSubCategory({ id: subCategory._id, name: subCategory.subCategoryName })}>Edit</Button>
                                                {editSubCategory.id === subCategory._id &&
                                                    <div className="mt-2">
                                                        <Form.Control
                                                            type="text"
                                                            value={editSubCategory.name}
                                                            onChange={(e) => setEditSubCategory({ ...editSubCategory, name: e.target.value })}
                                                            placeholder="New Subcategory Name"
                                                        />
                                                        <Button variant="primary" className="mt-2" onClick={() => handleEditSubCategory(category._id, subCategory._id)}>Save</Button>
                                                    </div>
                                                }
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </Card.Body>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CategoriesCrud;
