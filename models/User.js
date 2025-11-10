const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    contraseña: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    rol: {
      type: DataTypes.ENUM("admin", "agente", "cliente"),
      allowNull: false,
      validate: {
        isIn: [["admin", "agente", "cliente"]]
      }
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    reset_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_token_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['correo']
      },
      {
        fields: ['rol']
      },
      {
        fields: ['is_active']
      }
    ]
  },
)

module.exports = User
