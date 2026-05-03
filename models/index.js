const sequelize = require("../config/database");
const User = require("./User");
const Farm = require("./Farm");
const Bookmark = require("./Bookmark");

// ==========================================
// Relasi antar tabel sesuai jurnal AyamHub
// ==========================================

// User - Farm: 1 to 1
// 1 pengguna hanya dapat membuat 1 peternakan
// 1 peternakan hanya dimiliki oleh 1 pengguna
User.hasOne(Farm, {
  foreignKey: "id_user",
  as: "farm",
  onDelete: "CASCADE",
});
Farm.belongsTo(User, {
  foreignKey: "id_user",
  as: "owner",
});

// User - Bookmark: 1 to Many
// 1 user dapat memiliki lebih dari 1 bookmark
User.hasMany(Bookmark, {
  foreignKey: "id_user",
  as: "bookmarks",
  onDelete: "CASCADE",
});
Bookmark.belongsTo(User, {
  foreignKey: "id_user",
  as: "user",
});

// Farm - Bookmark: 1 to Many
// 1 peternakan dapat memiliki lebih dari 1 bookmark
Farm.hasMany(Bookmark, {
  foreignKey: "id_farm",
  as: "bookmarks",
  onDelete: "CASCADE",
});
Bookmark.belongsTo(Farm, {
  foreignKey: "id_farm",
  as: "farm",
});

module.exports = {
  sequelize,
  User,
  Farm,
  Bookmark,
};
