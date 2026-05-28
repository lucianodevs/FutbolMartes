const asyncHandler = require('../utils/asyncHandler');
const { getOverview } = require('../services/statsService');

const overviewHandler = asyncHandler(async (req, res) => {
  const result = await getOverview();
  res.json({ success: true, data: result });
});

module.exports = { overviewHandler };
