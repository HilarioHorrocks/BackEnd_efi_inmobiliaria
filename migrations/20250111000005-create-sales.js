'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('sales'));
    
    if (tableExists) {
      console.log('Table sales already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('sales', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_propiedad: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'properties',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_cliente: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'clients',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fecha_venta: {
        type: Sequelize.DATE,
        allowNull: false
      },
      monto_total: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      monto_comision: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      porcentaje_comision: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: true
      },
      forma_pago: {
        type: Sequelize.ENUM('contado', 'financiado', 'mixto'),
        defaultValue: 'contado'
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('finalizada', 'cancelada', 'pendiente'),
        defaultValue: 'pendiente'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci'
    });

    await queryInterface.addIndex('sales', ['id_propiedad'], { name: 'sales_id_propiedad' });
    await queryInterface.addIndex('sales', ['id_cliente'], { name: 'sales_id_cliente' });
    await queryInterface.addIndex('sales', ['estado'], { name: 'sales_estado' });
    await queryInterface.addIndex('sales', ['fecha_venta'], { name: 'sales_fecha_venta' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('sales');
  }
};
