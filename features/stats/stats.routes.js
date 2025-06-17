const express = require('express');
const router = express.Router();
const StatsController = require('./stats.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

// Product Routes
router.get('/total-products', [authMiddleware], StatsController.getTotalProducts);
router.get('/total-stocks', [authMiddleware], StatsController.getTotalStocks);

router.get('/total-prices', [authMiddleware], StatsController.getTotalPricesOfProducts);
router.get('/profit', [authMiddleware], StatsController.inOut);



module.exports = router;
