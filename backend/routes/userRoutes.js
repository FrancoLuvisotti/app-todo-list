const express = require('express');
const router = express.Router();
const { getMe } = require('../controllers/userController');
const { updateMe } = require('../controllers/userController');
const { deleteMe } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/me', authMiddleware, getMe);
router.put('/me', authMiddleware, updateMe);
router.delete('/me', authMiddleware, deleteMe);

module.exports = router;
