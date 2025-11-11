const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Property = sequelize.define(
  "Property",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [5, 255]
      }
    },
    tipo: {
      type: DataTypes.ENUM("casa", "apartamento", "local", "oficina", "terreno", "loft"),
      allowNull: false,
      validate: {
        isIn: [["casa", "apartamento", "local", "oficina", "terreno", "loft"]]
      }
    },
    precio: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    estado: {
      type: DataTypes.ENUM("disponible", "alquilada", "vendida", "reservada"),
      allowNull: false,
      defaultValue: "disponible",
      validate: {
        isIn: [["disponible", "alquilada", "vendida", "reservada"]]
      }
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 1000]
      }
    },
    tamano: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    habitaciones: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 20
      }
    },
    banos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 0,
        max: 10
      }
    },
    garajes: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 10
      }
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: true,
      validate: {
        len: [0, 100]
      }
    },
    codigo_postal: {
      type: DataTypes.STRING(10),
      allowNull: true,
      validate: {
        len: [0, 10]
      }
    },
    imagenes: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    caracteristicas: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    },
    disponibilidad: {
      type: DataTypes.ENUM('venta', 'alquiler', 'ambos'),
      allowNull: false,
      defaultValue: 'ambos',
      validate: {
        isIn: [['venta', 'alquiler', 'ambos']]
      }
    },
    id_agente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
  },
  {
    tableName: "properties",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['tipo']
      },
      {
        fields: ['disponibilidad']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['precio']
      },
      {
        fields: ['ciudad']
      },
      {
        fields: ['id_agente']
      },
      {
        fields: ['created_at']
      }
    ]
  },
)

module.exports = Property
