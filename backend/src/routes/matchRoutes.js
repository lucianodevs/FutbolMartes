const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { listHandler, getByIdHandler, createHandler, updateHandler, deleteHandler, statsHandler } = require('../controllers/matchController');

const router = express.Router();

router.get('/', listHandler);
router.get('/stats', statsHandler);
router.get('/:id', getByIdHandler);
router.post('/', protect, createHandler);
router.put('/:id', protect, updateHandler);
router.delete('/:id', protect, deleteHandler);

module.exports = router;
