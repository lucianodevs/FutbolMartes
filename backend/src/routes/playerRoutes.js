const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  listHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  overviewHandler,
} = require('../controllers/playerController');

const router = express.Router();

router.get('/', listHandler);
router.get('/overview', overviewHandler);
router.get('/:id', getByIdHandler);
router.post('/', protect, createHandler);
router.put('/:id', protect, updateHandler);
router.delete('/:id', protect, deleteHandler);

module.exports = router;
