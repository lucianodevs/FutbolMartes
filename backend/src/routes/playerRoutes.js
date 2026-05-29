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

const multer = require('multer');
const path = require('path');

// Si se configura S3 (via env S3_BUCKET) usamos memoryStorage para pasar el buffer al controlador.
let storage;
if (process.env.S3_BUCKET) {
  storage = multer.memoryStorage();
} else {
  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '..', '..', 'uploads'));
    },
    filename: function (req, file, cb) {
      const ext = path.extname(file.originalname);
      const name = `player_${req.params.id}_${Date.now()}${ext}`;
      cb(null, name);
    }
  });
}

const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } });

router.get('/', listHandler);
router.get('/overview', overviewHandler);
router.get('/:id', getByIdHandler);
router.post('/', protect, createHandler);
router.put('/:id', protect, updateHandler);
router.delete('/:id', protect, deleteHandler);
router.post('/:id/photo', protect, upload.single('photo'), require('../controllers/playerController').uploadPhotoHandler);

module.exports = router;
