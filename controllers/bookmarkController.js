const { Bookmark, Farm, User } = require("../models");

// ==========================================
// Add Bookmark - Menambahkan bookmark peternakan
// ==========================================
const addBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id_user;
    const { id_farm } = req.body;

    if (!id_farm) {
      return res.status(400).json({
        status: "error",
        message: "ID peternakan wajib diisi",
      });
    }

    // Cek apakah peternakan ada
    const farm = await Farm.findByPk(id_farm);
    if (!farm) {
      return res.status(404).json({
        status: "error",
        message: "Peternakan tidak ditemukan",
      });
    }

    // Cek apakah sudah di-bookmark
    const existingBookmark = await Bookmark.findOne({
      where: { id_user: userId, id_farm },
    });
    if (existingBookmark) {
      return res.status(409).json({
        status: "error",
        message: "Peternakan sudah ada di daftar bookmark Anda",
      });
    }

    const bookmark = await Bookmark.create({
      id_user: userId,
      id_farm,
    });

    return res.status(201).json({
      status: "success",
      message: "Peternakan berhasil ditambahkan ke daftar bookmark",
      data: bookmark,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Delete Bookmark - Menghapus bookmark peternakan
// ==========================================
const deleteBookmark = async (req, res, next) => {
  try {
    const userId = req.user.id_user;
    const { id } = req.params;

    const bookmark = await Bookmark.findOne({
      where: { id_bookmark: id, id_user: userId },
    });

    if (!bookmark) {
      return res.status(404).json({
        status: "error",
        message: "Bookmark tidak ditemukan",
      });
    }

    await bookmark.destroy();

    return res.status(200).json({
      status: "success",
      message: "Peternakan berhasil dihapus dari daftar bookmark",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Get All Bookmarks For User - Mendapatkan seluruh bookmark pengguna
// ==========================================
const getAllBookmarksForUser = async (req, res, next) => {
  try {
    const userId = req.user.id_user;

    const bookmarks = await Bookmark.findAll({
      where: { id_user: userId },
      include: [
        {
          model: Farm,
          as: "farm",
          include: [
            {
              model: User,
              as: "owner",
              attributes: ["id_user", "nama", "email"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    if (bookmarks.length === 0) {
      return res.status(200).json({
        status: "success",
        message: "Data bookmark peternakan kosong",
        data: [],
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Daftar bookmark peternakan berhasil diambil",
      data: bookmarks,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// Check Bookmark Status - Mengecek status bookmark peternakan
// ==========================================
const checkBookmarkStatus = async (req, res, next) => {
  try {
    const userId = req.user.id_user;
    const { id_farm } = req.params;

    const bookmark = await Bookmark.findOne({
      where: { id_user: userId, id_farm },
    });

    return res.status(200).json({
      status: "success",
      data: {
        isBookmarked: !!bookmark,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addBookmark,
  deleteBookmark,
  getAllBookmarksForUser,
  checkBookmarkStatus,
};
