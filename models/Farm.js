const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Farm = sequelize.define(
  "Farm",
  {
    id_farm: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id_user",
      },
    },
    nama_peternakan: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: { msg: "Nama peternakan sudah terdaftar" },
      validate: {
        notEmpty: { msg: "Nama peternakan tidak boleh kosong" },
      },
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    alamat: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Alamat peternakan tidak boleh kosong" },
      },
    },
    kota: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    provinsi: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    foto_peternakan: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: { msg: "Foto peternakan wajib diupload" },
      },
    },
    kapasitas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: { msg: "Kapasitas harus berupa angka" },
      },
    },
    no_telepon: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: "farms",
  }
);

module.exports = Farm;
