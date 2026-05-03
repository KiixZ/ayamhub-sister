const express = require("express");
const router = express.Router();
const farmController = require("../controllers/farmController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Protected routes (membutuhkan token JWT)
router.get("/my-farm", authenticate, farmController.getUserFarm);
router.get("/", authenticate, farmController.getAllFarms);
router.get("/:id", authenticate, farmController.getFarmDetails);
router.post(
  "/",
  authenticate,
  upload.single("foto_peternakan"),
  farmController.createFarm
);
router.put(
  "/:id",
  authenticate,
  upload.single("foto_peternakan"),
  farmController.updateFarm
);

module.exports = router;
