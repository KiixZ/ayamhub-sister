const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const { sequelize } = require("./models");
const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// Middleware
// ==========================================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve uploaded files secara statis
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// Routes
// ==========================================
app.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "Selamat datang di AyamHub API",
    version: "1.0.0",
    endpoints: {
      users: "/api/users",
      farms: "/api/farms",
      bookmarks: "/api/bookmarks",
    },
  });
});

app.use("/api", routes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    status: "error",
    message: "Endpoint tidak ditemukan",
  });
});

// Error handler
app.use(errorHandler);

// ==========================================
// Database Sync & Server Start
// ==========================================
const startServer = async () => {
  try {
    // Sinkronisasi database (buat tabel jika belum ada)
    await sequelize.sync({ alter: true });
    console.log("Database berhasil disinkronisasi");

    app.listen(PORT, () => {
      console.log(`AyamHub API berjalan di http://localhost:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Gagal memulai server:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
