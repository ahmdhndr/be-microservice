const express = require('express');
const handler = require('./handler/media');

const router = express.Router();

router.post('/', handler.postImage);
router.get('/', handler.getAllImage);
router.delete('/:id', handler.deleteImageById);

module.exports = router;
