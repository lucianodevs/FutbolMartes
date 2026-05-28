const asyncHandler = require('../utils/asyncHandler');
const { list, get, create, update, remove, stats } = require('../services/matchService');

const listHandler = asyncHandler(async (req, res) => {
  const result = await list(req.query);
  res.json({ success: true, data: result });
});

const getByIdHandler = asyncHandler(async (req, res) => {
  const result = await get(req.params.id);
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

const statsHandler = asyncHandler(async (req, res) => {
  const result = await stats();
  res.json({ success: true, data: result });
});

module.exports = {
  listHandler,
  getByIdHandler,
  createHandler,
  updateHandler,
  deleteHandler,
  statsHandler,
};
