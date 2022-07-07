const express = require('express');
const handler = require('./handler/users');
const verifyToken = require('../middlewares/verifyToken');

const router = express.Router();

router.get('/', verifyToken, handler.getUserProfile);
router.put('/', verifyToken, handler.updateUser);
router.post('/register', handler.registerUser);
router.post('/login', handler.loginUser);
router.post('/logout', verifyToken, handler.logoutUser);

module.exports = router;
