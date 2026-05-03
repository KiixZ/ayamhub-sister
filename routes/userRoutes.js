const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Modul Pengguna — registrasi, login, logout, dan manajemen profil
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrasi pengguna baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *               - email
 *               - password
 *             properties:
 *               nama:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               no_telepon:
 *                 type: string
 *                 example: "081234567890"
 *               alamat:
 *                 type: string
 *                 example: Jl. Raya No.1, Surabaya
 *     responses:
 *       201:
 *         description: Registrasi berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Registrasi berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validasi gagal (field kosong, email invalid, password terlalu pendek)
 *       409:
 *         description: Email sudah terdaftar
 */
router.post("/register", userController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login pengguna
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login berhasil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Login berhasil
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     token:
 *                       type: string
 *       400:
 *         description: Validasi gagal
 *       401:
 *         description: Password salah
 *       404:
 *         description: Email belum terdaftar
 */
router.post("/login", userController.login);

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Logout pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout berhasil
 */
router.post("/logout", authenticate, userController.logout);

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Mendapatkan data profil pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data pengguna berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token tidak valid atau tidak ada
 */
router.get("/profile", authenticate, userController.getProfile);

/**
 * @swagger
 * /api/users/update:
 *   put:
 *     summary: Memperbarui data pengguna
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               no_telepon:
 *                 type: string
 *               alamat:
 *                 type: string
 *               foto_profil:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Update data berhasil
 *       401:
 *         description: Token tidak valid
 *       409:
 *         description: Email sudah terdaftar
 */
router.put(
  "/update",
  authenticate,
  upload.single("foto_profil"),
  userController.updateData
);

module.exports = router;
