function notFound(req, res, next) {
  const error = new Error(`Ruta no encontrada - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? err.statusCode || 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    details: err.details || null,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
}

module.exports = { notFound, errorHandler };
