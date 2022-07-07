const express = require('express');
const handler = require('./handler/refresh-tokens');

const router = express.Router();

router.post('/', handler.refreshToken);

module.exports = router;
