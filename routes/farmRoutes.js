const express = require("express");
const router = express.Router();
const farmController = require("../controllers/farmController");
const { authenticate } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

/**
 * @swagger
 * tags:
 *   name: Farms
 *   description: Modul Peternakan — CRUD data peternakan ayam broiler
 */

/**
 * @swagger
 * /api/farms/my-farm:
 *   get:
 *     summary: Mendapatkan peternakan milik user yang login
 *     tags: [Farms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Data peternakan user berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Farm'
 *       401:
 *         description: Token tidak valid
 *       404:
 *         description: User belum memiliki peternakan
 */
router.get("/my-farm", authenticate, farmController.getUserFarm);

/**
 * @swagger
 * /api/farms:
 *   get:
 *     summary: Mendapatkan seluruh data peternakan (dengan pagination & search)
 *     tags: [Farms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Nomor halaman
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Jumlah data per halaman
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Kata kunci pencarian (nama peternakan, kota, atau provinsi)
 *     responses:
 *       200:
 *         description: Data seluruh peternakan berhasil diambil
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
 *                     $ref: '#/components/schemas/Farm'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 */
router.get("/", authenticate, farmController.getAllFarms);

/**
 * @swagger
 * /api/farms/{id}:
 *   get:
 *     summary: Mendapatkan detail peternakan berdasarkan ID
 *     tags: [Farms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID peternakan
 *     responses:
 *       200:
 *         description: Detail peternakan berhasil diambil
 *       404:
 *         description: Peternakan tidak ditemukan
 */
router.get("/:id", authenticate, farmController.getFarmDetails);

/**
 * @swagger
 * /api/farms:
 *   post:
 *     summary: Membuat peternakan baru (dengan upload foto)
 *     tags: [Farms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nama_peternakan
 *               - alamat
 *               - kota
 *               - provinsi
 *               - kapasitas
 *               - foto_peternakan
 *             properties:
 *               nama_peternakan:
 *                 type: string
 *                 example: Peternakan Jaya Abadi
 *               deskripsi:
 *                 type: string
 *                 example: Peternakan ayam broiler modern
 *               alamat:
 *                 type: string
 *                 example: Jl. Raya No.1
 *               kota:
 *                 type: string
 *                 example: Surabaya
 *               provinsi:
 *                 type: string
 *                 example: Jawa Timur
 *               kapasitas:
 *                 type: integer
 *                 example: 5000
 *               no_telepon:
 *                 type: string
 *                 example: "081234567890"
 *               foto_peternakan:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Peternakan berhasil didaftarkan
 *       400:
 *         description: Validasi gagal atau user sudah memiliki peternakan
 */
router.post(
  "/",
  authenticate,
  upload.single("foto_peternakan"),
  farmController.createFarm
);

/**
 * @swagger
 * /api/farms/{id}:
 *   put:
 *     summary: Memperbarui data peternakan (hanya pemilik)
 *     tags: [Farms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID peternakan
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_peternakan:
 *                 type: string
 *               deskripsi:
 *                 type: string
 *               alamat:
 *                 type: string
 *               kota:
 *                 type: string
 *               provinsi:
 *                 type: string
 *               kapasitas:
 *                 type: integer
 *               no_telepon:
 *                 type: string
 *               foto_peternakan:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Data peternakan berhasil diperbarui
 *       403:
 *         description: Bukan pemilik peternakan
 *       404:
 *         description: Peternakan tidak ditemukan
 */
router.put(
  "/:id",
  authenticate,
  upload.single("foto_peternakan"),
  farmController.updateFarm
);

module.exports = router;
