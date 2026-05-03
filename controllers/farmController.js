const { Farm, User } = require("../models");

// ==========================================
// Get User Farm - Mendapatkan peternakan milik pengguna
// ==========================================
const getUserFarm = async (req, res, next) => {
  try {
    const farm = await Farm.findOne({
      where: { id_user: req.user.id_user },
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id_user", "nama", "email"],
        },
      ],
    });

    if (!farm) {
      return res.status(404).json({
        status: "error",
        message:
          "Anda belum memiliki peternakan. Silakan buat peternakan terlebih dahulu.",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data peternakan pengguna berhasil diambil",
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Farms - Mendapatkan seluruh peternakan
// ==========================================
const getAllFarms = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const whereClause = {};
    if (search) {
      const { Op } = require("sequelize");
      whereClause[Op.or] = [
        { nama_peternakan: { [Op.like]: `%${search}%` } },
        { kota: { [Op.like]: `%${search}%` } },
        { provinsi: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows: farms } = await Farm.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id_user", "nama", "email"],
        },
      ],
      limit: parseInt(limit),
      offset,
      order: [["created_at", "DESC"]],
    });

    if (count === 0) {
      return res.status(200).json({
        status: "success",
        message: "Data peternakan kosong",
        data: [],
        pagination: {
          total: 0,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: 0,
        },
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data seluruh peternakan berhasil diambil",
      data: farms,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get Farm Details - Mendapatkan detail peternakan
// ==========================================
const getFarmDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const farm = await Farm.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id_user", "nama", "email", "no_telepon"],
        },
      ],
    });

    if (!farm) {
      return res.status(404).json({
        status: "error",
        message: "Peternakan tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Detail peternakan berhasil diambil",
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Create Farm - Membuat peternakan baru
// ==========================================
const createFarm = async (req, res, next) => {
  try {
    const userId = req.user.id_user;

    // Cek apakah user sudah memiliki peternakan (relasi 1:1)
    const existingFarm = await Farm.findOne({ where: { id_user: userId } });
    if (existingFarm) {
      return res.status(409).json({
        status: "error",
        message: "Anda sudah memiliki peternakan. 1 pengguna hanya dapat memiliki 1 peternakan.",
      });
    }

    // Validasi foto peternakan wajib diupload
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Foto peternakan wajib diupload",
      });
    }

    const {
      nama_peternakan,
      deskripsi,
      alamat,
      kota,
      provinsi,
      kapasitas,
      no_telepon,
    } = req.body;

    // Cek nama peternakan sudah terdaftar atau belum
    const existingName = await Farm.findOne({ where: { nama_peternakan } });
    if (existingName) {
      return res.status(409).json({
        status: "error",
        message: "Nama peternakan sudah terdaftar. Silakan gunakan nama lain.",
      });
    }

    const farm = await Farm.create({
      id_user: userId,
      nama_peternakan,
      deskripsi: deskripsi || null,
      alamat,
      kota: kota || null,
      provinsi: provinsi || null,
      foto_peternakan: req.file.filename,
      kapasitas: kapasitas ? parseInt(kapasitas) : null,
      no_telepon: no_telepon || null,
    });

    return res.status(201).json({
      status: "success",
      message: "Peternakan berhasil didaftarkan",
      data: farm,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Farm - Memperbarui data peternakan
// ==========================================
const updateFarm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id_user;

    // Cari peternakan
    const farm = await Farm.findByPk(id);
    if (!farm) {
      return res.status(404).json({
        status: "error",
        message: "Peternakan tidak ditemukan",
      });
    }

    // Pastikan hanya pemilik yang bisa update
    if (farm.id_user !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Anda tidak memiliki akses untuk mengubah peternakan ini",
      });
    }

    const {
      nama_peternakan,
      deskripsi,
      alamat,
      kota,
      provinsi,
      kapasitas,
      no_telepon,
    } = req.body;

    // Cek jika nama peternakan diubah, pastikan belum terdaftar
    if (nama_peternakan && nama_peternakan !== farm.nama_peternakan) {
      const existingName = await Farm.findOne({ where: { nama_peternakan } });
      if (existingName) {
        return res.status(409).json({
          status: "error",
          message: "Nama peternakan sudah terdaftar. Silakan gunakan nama lain.",
        });
      }
    }

    // Validasi: jika foto dihapus (field kosong) tapi tidak upload foto baru
    if (req.body.hapus_foto === "true" && !req.file) {
      return res.status(400).json({
        status: "error",
        message: "Silakan upload foto peternakan baru",
      });
    }

    const updateFields = {};
    if (nama_peternakan) updateFields.nama_peternakan = nama_peternakan;
    if (deskripsi !== undefined) updateFields.deskripsi = deskripsi;
    if (alamat) updateFields.alamat = alamat;
    if (kota !== undefined) updateFields.kota = kota;
    if (provinsi !== undefined) updateFields.provinsi = provinsi;
    if (kapasitas !== undefined)
      updateFields.kapasitas = kapasitas ? parseInt(kapasitas) : null;
    if (no_telepon !== undefined) updateFields.no_telepon = no_telepon;
    if (req.file) updateFields.foto_peternakan = req.file.filename;

    await Farm.update(updateFields, { where: { id_farm: id } });

    const updatedFarm = await Farm.findByPk(id, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id_user", "nama", "email"],
        },
      ],
    });

    return res.status(200).json({
      status: "success",
      message: "Data peternakan berhasil diperbarui",
      data: updatedFarm,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserFarm,
  getAllFarms,
  getFarmDetails,
  createFarm,
  updateFarm,
};
