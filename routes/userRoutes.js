const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Public routes
router.post("/register", userController.register);
router.post("/login", userController.login);

// Protected routes (membutuhkan token JWT)
router.post("/logout", authenticate, userController.logout);
router.get("/profile", authenticate, userController.getProfile);
router.put(
  "/update",
  authenticate,
  upload.single("foto_profil"),
  userController.updateData
);

module.exports = router;
