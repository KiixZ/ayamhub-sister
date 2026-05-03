require("dotenv").config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET || "ayamhub_default_secret_key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",
};
