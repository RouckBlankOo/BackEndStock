const express = require('express');
const router = express.Router();
const ProductController = require('./product.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Product Routes
router.post('/products',[authMiddleware],  ProductController.createProduct);  
router.put('/products/:id/stock',[authMiddleware],  ProductController.updateProductStock);  
router.get('/products/:id/stock-history',[authMiddleware],  ProductController.getProductStockHistory);  
router.get('/get-products',[authMiddleware],  ProductController.getProducts);
router.put('/products/:id',[authMiddleware],  ProductController.updateProduct);

// Stock History Routes
router.get('/user/:userId/stock-history',[authMiddleware],  ProductController.getUserStockHistory);  
router.get('/stock-history',[authMiddleware],  ProductController.getAllStockHistory);  

module.exports = router;
