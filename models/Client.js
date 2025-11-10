const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    documento_identidad: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [5, 20]
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      validate: {
        len: [0, 20]
      }
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        len: [0, 255]
      }
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      validate: {
        isDate: true,
        isBefore: new Date().toISOString().split('T')[0] // No puede ser fecha futura
      }
    },
    profesion: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    estado_civil: {
      type: DataTypes.ENUM("soltero", "soltera", "casado", "casada", "divorciado", "divorciada", "viudo", "viuda", "union_libre"),
      allowNull: true,
      validate: {
        isIn: [["soltero", "casado", "divorciado", "viudo", "union_libre"]]
      }
    },
    ingresos_mensuales: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    preferencias: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {}
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
  },
  {
    tableName: "clients",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ['documento_identidad']
      },
      {
        unique: true,
        fields: ['id_usuario']
      },
      {
        fields: ['telefono']
      },
      {
        fields: ['profesion']
      }
    ]
  },
)

module.exports = Client
