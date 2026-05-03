const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");
const { User } = require("../models");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        status: "error",
        message: "Akses ditolak. Token tidak ditemukan.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, jwtSecret);

    const user = await User.findByPk(decoded.id_user);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Token tidak valid. Pengguna tidak ditemukan.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token telah kadaluarsa. Silakan login kembali.",
      });
    }
    return res.status(401).json({
      status: "error",
      message: "Token tidak valid.",
    });
  }
};

module.exports = { authenticate };
