const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/auth");
const { User } = require("../models");

// ==========================================
// Register - Mendaftarkan pengguna baru
// ==========================================
const register = async (req, res, next) => {
  try {
    const { nama, email, password, no_telepon, alamat } = req.body;

    // Validasi field wajib
    if (!nama || !email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Nama, email, dan password wajib diisi",
      });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "Email sudah terdaftar. Silakan gunakan email lain.",
      });
    }

    // Buat user baru
    const user = await User.create({
      nama,
      email,
      password,
      no_telepon: no_telepon || null,
      alamat: alamat || null,
    });

    // Generate JWT token
    const token = jwt.sign({ id_user: user.id_user }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return res.status(201).json({
      status: "success",
      message: "Registrasi berhasil",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Login - Autentikasi pengguna
// ==========================================
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "error",
        message: "Email dan password wajib diisi",
      });
    }

    // Cari user berdasarkan email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Email belum terdaftar",
      });
    }

    // Validasi password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Email atau password salah",
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id_user: user.id_user }, jwtSecret, {
      expiresIn: jwtExpiresIn,
    });

    return res.status(200).json({
      status: "success",
      message: "Login berhasil",
      data: {
        user: user.toJSON(),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Logout - Mengeluarkan pengguna
// ==========================================
const logout = async (_req, res) => {
  // JWT bersifat stateless, logout dilakukan di sisi client
  // dengan menghapus token dari penyimpanan lokal
  return res.status(200).json({
    status: "success",
    message: "Logout berhasil",
  });
};

// ==========================================
// Get Profile - Mendapatkan data pengguna
// ==========================================
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id_user);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "Pengguna tidak ditemukan",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Data pengguna berhasil diambil",
      data: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Update Data - Memperbarui data pengguna
// ==========================================
const updateData = async (req, res, next) => {
  try {
    const { nama, email, password, no_telepon, alamat } = req.body;
    const userId = req.user.id_user;

    // Cek jika email diubah, pastikan email baru belum terdaftar
    if (email && email !== req.user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({
          status: "error",
          message: "Email telah terdaftar. Silakan gunakan email lain.",
        });
      }
    }

    // Update data
    const updateFields = {};
    if (nama) updateFields.nama = nama;
    if (email) updateFields.email = email;
    if (password) updateFields.password = password;
    if (no_telepon !== undefined) updateFields.no_telepon = no_telepon;
    if (alamat !== undefined) updateFields.alamat = alamat;

    // Handle foto profil jika ada upload
    if (req.file) {
      updateFields.foto_profil = req.file.filename;
    }

    await User.update(updateFields, {
      where: { id_user: userId },
      individualHooks: true, // agar hook beforeUpdate berjalan (hash password)
    });

    const updatedUser = await User.findByPk(userId);

    return res.status(200).json({
      status: "success",
      message: "Update data berhasil",
      data: updatedUser.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  updateData,
};
