const { DataTypes } = require("sequelize")
const sequelize = require("../config/database")

const Rental = sequelize.define(
  "Rental",
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
    fecha_inicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfter: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // No más de 30 días en el pasado
      }
    },
    fecha_fin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: true,
        isAfterStartDate(value) {
          if (value <= this.fecha_inicio) {
            throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
          }
        }
      }
    },
    monto_mensual: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      validate: {
        min: 0,
        isDecimal: true
      }
    },
    monto_deposito: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      validate: {
        min: 0
      }
    },
    monto_administracion: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      defaultValue: 0,
      validate: {
        min: 0
      }
    },
    estado: {
      type: DataTypes.ENUM("activo", "finalizado", "cancelado", "pendiente"),
      allowNull: false,
      defaultValue: "pendiente",
      validate: {
        isIn: [["activo", "finalizado", "cancelado", "pendiente"]]
      }
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: [0, 500]
      }
    },
    numero_contrato: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      validate: {
        len: [0, 50]
      }
    },
    renovacion_automatica: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    servicios_incluidos: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: []
    }
  },
  {
    tableName: "rentals",
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
        fields: ['fecha_inicio']
      },
      {
        fields: ['fecha_fin']
      },
      {
        fields: ['estado']
      },
      {
        unique: true,
        fields: ['numero_contrato']
      }
    ]
  },
)

module.exports = Rental
