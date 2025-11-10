const { Sequelize } = require("sequelize")
require("dotenv").config()

// Configuración MySQL para producción
const sequelize = new Sequelize(
  process.env.DB_NAME || "inmobiliaria",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false,
    define: {
      timestamps: true,
      underscored: false,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
)

module.exports = sequelize
