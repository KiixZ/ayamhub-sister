const express = require("express");
const router = express.Router();
const userRoutes = require("./userRoutes");
const farmRoutes = require("./farmRoutes");
const bookmarkRoutes = require("./bookmarkRoutes");

router.use("/users", userRoutes);
router.use("/farms", farmRoutes);
router.use("/bookmarks", bookmarkRoutes);

module.exports = router;
