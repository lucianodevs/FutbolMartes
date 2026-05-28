const asyncHandler = require('../utils/asyncHandler');
const { listPlayers, getPlayer, create, update, remove, overview } = require('../services/playerService');

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

module.exports = {
  listHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  overviewHandler,
};
