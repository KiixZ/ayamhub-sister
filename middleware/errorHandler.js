const errorHandler = (err, _req, res, _next) => {
  console.error("Error:", err.message);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      status: "error",
      message: "Ukuran file terlalu besar. Maksimal 5MB.",
    });
  }

  // Multer error
  if (err.name === "MulterError") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  // Sequelize validation error
  if (err.name === "SequelizeValidationError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(400).json({
      status: "error",
      message: "Validasi gagal",
      errors: messages,
    });
  }

  // Sequelize unique constraint error
  if (err.name === "SequelizeUniqueConstraintError") {
    const messages = err.errors.map((e) => e.message);
    return res.status(409).json({
      status: "error",
      message: "Data sudah ada",
      errors: messages,
    });
  }

  // Default server error
  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Terjadi kesalahan pada server",
  });
};

module.exports = errorHandler;
