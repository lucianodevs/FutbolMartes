const asyncHandler = require('../utils/asyncHandler');
const { getOverview } = require('../services/statsService');
const { generateWorkbook } = require('../services/exportService');

const { protect } = require('../middlewares/authMiddleware');

const overviewHandler = asyncHandler(async (req, res) => {
  const result = await getOverview();
  res.json({ success: true, data: result });
});

const exportHandler = asyncHandler(async (req, res) => {
  if (!req.user || req.user.rol !== 'admin') {
    return res.status(403).json({ success: false, message: 'Acceso denegado' });
  }

  const workbook = await generateWorkbook();
  const buffer = await workbook.xlsx.writeBuffer();
  res.setHeader('Content-Disposition', 'attachment; filename="futbol_datos.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(Buffer.from(buffer));
});

module.exports = { overviewHandler, exportHandler };
