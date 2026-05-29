const asyncHandler = require('../utils/asyncHandler');
const { listPlayers, getPlayer, create, update, remove, overview, setPlayerPhoto } = require('../services/playerService');
const path = require('path');

let S3Client, PutObjectCommand;
if (process.env.S3_BUCKET) {
  try {
    ({ S3Client, PutObjectCommand } = require('@aws-sdk/client-s3'));
  } catch (err) {
    console.warn('AWS SDK not installed. Install @aws-sdk/client-s3 to enable S3 uploads.');
  }
}

const listHandler = asyncHandler(async (req, res) => {
  const result = await listPlayers(req.query);
  res.json({ success: true, data: result });
});

const getByIdHandler = asyncHandler(async (req, res) => {
  const result = await getPlayer(req.params.id);
  res.json({ success: true, data: result });
});

const createHandler = asyncHandler(async (req, res) => {
  const result = await create(req.body, req.user.id);
  res.status(201).json({ success: true, data: result });
});

const updateHandler = asyncHandler(async (req, res) => {
  const result = await update(req.params.id, req.body);
  res.json({ success: true, data: result });
});

const deleteHandler = asyncHandler(async (req, res) => {
  const result = await remove(req.params.id);
  res.json({ success: true, data: result });
});

const overviewHandler = asyncHandler(async (req, res) => {
  const result = await overview();
  res.json({ success: true, data: result });
});

const uploadPhotoHandler = asyncHandler(async (req, res) => {
  const playerId = req.params.id;
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No se recibió archivo' });
  }

  let fotoPath;

  // Si hay S3 configurado y el SDK disponible, subimos a S3 usando el buffer
  if (process.env.S3_BUCKET && S3Client && PutObjectCommand && req.file.buffer) {
    const region = process.env.AWS_REGION || 'us-east-1';
    const bucket = process.env.S3_BUCKET;
    const ext = path.extname(req.file.originalname) || '';
    const key = `players/player_${playerId}_${Date.now()}${ext}`;

    const client = new S3Client({ region });
    const params = {
      Bucket: bucket,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read'
    };
    await client.send(new PutObjectCommand(params));

    if (process.env.S3_PUBLIC_URL) {
      fotoPath = `${process.env.S3_PUBLIC_URL.replace(/\/$/, '')}/${key}`;
    } else {
      fotoPath = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
    }
  } else if (req.file.path || req.file.filename) {
    // Fallback a almacenamiento en disco local (ruta relativa)
    const filename = req.file.filename || path.basename(req.file.path);
    fotoPath = `/uploads/${filename}`;
  } else {
    return res.status(500).json({ success: false, message: 'No se pudo procesar el archivo' });
  }

  const updated = await setPlayerPhoto(playerId, fotoPath);
  // devolver URL absoluta para que el frontend no necesite construirla
  const host = req.get('host');
  const protocol = req.protocol;
  if (updated && updated.foto && !updated.foto.startsWith('http')) {
    updated.foto = `${protocol}://${host}${updated.foto}`;
  }
  res.json({ success: true, data: updated });
});

module.exports = {
  listHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  overviewHandler,
  uploadPhotoHandler,
};
