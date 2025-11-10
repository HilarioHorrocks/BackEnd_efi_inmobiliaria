const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Sale = sequelize.define(
  "Sale",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_propiedad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'properties',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    fecha_venta: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: true
      }
    },
    monto_total: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    monto_comision: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    porcentaje_comision: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true,
      defaultValue: 5.00,
      validate: {
        min: 0,
        max: 100
      }
    },
    estado: {
      type: DataTypes.ENUM("pendiente", "finalizada", "cancelada"),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: [["pendiente", "finalizada", "cancelada"]]
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    forma_pago: {
      type: DataTypes.ENUM("contado", "credito", "mixto"),
      allowNull: true,
      validate: {
        isIn: [["contado", "credito", "mixto"]]
      }
    },
    numero_escritura: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [0, 50]
      }
    }
  },
  {
    tableName: "sales",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['id_propiedad']
      },
      {
        fields: ['id_cliente']
      },
      {
        fields: ['fecha_venta']
      },
      {
        fields: ['estado']
      },
      {
        fields: ['monto_total']
      }
    ]
  },
)

module.exports = Sale
