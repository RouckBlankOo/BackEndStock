const express = require('express');
const router = express.Router();
const CategoryController = require('./category.controller');
const SubCategoryController = require('./sub-category.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Category Routes
router.post('/categories',[authMiddleware],  CategoryController.createCategory);  
router.put('/categories/:id',[authMiddleware],  CategoryController.updateCategory);  
router.delete('/categories/:id',[authMiddleware],  CategoryController.deleteCategory);  
router.get('/categories',[authMiddleware],  CategoryController.getCategories);  


router.post('/subcategories', [authMiddleware], SubCategoryController.createSubCategory);  
router.put('/subcategories/:id',[authMiddleware],  SubCategoryController.updateSubCategory); 
router.delete('/subcategories/:id', [authMiddleware], SubCategoryController.deleteSubCategory);  
router.get('/subcategories',[authMiddleware],  SubCategoryController.getSubCategories);  

module.exports = router;
