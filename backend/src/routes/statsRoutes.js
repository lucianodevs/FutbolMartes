const express = require('express');
const { overviewHandler, exportHandler } = require('../controllers/statsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/overview', overviewHandler);
router.get('/export', protect, exportHandler);

module.exports = router;
