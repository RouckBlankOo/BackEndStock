const express = require('express');
const router = express.Router();
const UserController = require('./user.controller');
const authMiddleware = require('../../middlewares/auth.middleware');

router.post('/login', UserController.login);
router.post('/users', [authMiddleware], UserController.createUser);
router.put('/users/:id', [authMiddleware], UserController.updateUser);
router.get('/users/:id/login-history', [authMiddleware], UserController.getLoginHistory);
router.get('/session', [authMiddleware], UserController.getUserSession);
router.get('/users', [authMiddleware], UserController.getAllUsers);

module.exports = router;
