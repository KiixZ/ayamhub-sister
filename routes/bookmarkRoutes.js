const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const { authenticate } = require("../middleware/authMiddleware");

// Semua route bookmark membutuhkan autentikasi
router.post("/", authenticate, bookmarkController.addBookmark);
router.delete("/:id", authenticate, bookmarkController.deleteBookmark);
router.get("/", authenticate, bookmarkController.getAllBookmarksForUser);
router.get(
  "/status/:id_farm",
  authenticate,
  bookmarkController.checkBookmarkStatus
);

module.exports = router;
