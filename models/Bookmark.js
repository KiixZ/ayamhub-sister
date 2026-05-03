const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Bookmark = sequelize.define(
  "Bookmark",
  {
    id_bookmark: {
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
    id_farm: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "farms",
        key: "id_farm",
      },
    },
  },
  {
    tableName: "bookmarks",
    indexes: [
      {
        unique: true,
        fields: ["id_user", "id_farm"],
      },
    ],
  }
);

module.exports = Bookmark;
