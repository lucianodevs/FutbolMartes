const express = require('express');
const { overviewHandler } = require('../controllers/statsController');

const router = express.Router();

router.get('/overview', overviewHandler);

module.exports = router;
