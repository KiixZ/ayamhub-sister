const express = require("express");
const router = express.Router();
const bookmarkController = require("../controllers/bookmarkController");
const { authenticate } = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Bookmarks
 *   description: Modul Bookmark — menyimpan peternakan favorit pengguna
 */

/**
 * @swagger
 * /api/bookmarks:
 *   post:
 *     summary: Menambahkan bookmark peternakan
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_farm
 *             properties:
 *               id_farm:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Peternakan berhasil ditambahkan ke daftar bookmark
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Bookmark'
 *       400:
 *         description: Peternakan sudah di-bookmark
 *       404:
 *         description: Peternakan tidak ditemukan
 */
router.post("/", authenticate, bookmarkController.addBookmark);

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   delete:
 *     summary: Menghapus bookmark
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID bookmark
 *     responses:
 *       200:
 *         description: Bookmark berhasil dihapus
 *       403:
 *         description: Bukan pemilik bookmark
 *       404:
 *         description: Bookmark tidak ditemukan
 */
router.delete("/:id", authenticate, bookmarkController.deleteBookmark);

/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Mendapatkan semua bookmark milik user
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar bookmark berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bookmark'
 */
router.get("/", authenticate, bookmarkController.getAllBookmarksForUser);

/**
 * @swagger
 * /api/bookmarks/status/{id_farm}:
 *   get:
 *     summary: Cek status bookmark suatu peternakan
 *     tags: [Bookmarks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_farm
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID peternakan
 *     responses:
 *       200:
 *         description: Status bookmark berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     isBookmarked:
 *                       type: boolean
 *                       example: true
 */
router.get(
  "/status/:id_farm",
  authenticate,
  bookmarkController.checkBookmarkStatus
);

module.exports = router;
