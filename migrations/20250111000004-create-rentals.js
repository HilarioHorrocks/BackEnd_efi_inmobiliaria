'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('rentals'));
    
    if (tableExists) {
      console.log('Table rentals already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('rentals', {
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
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fecha_fin: {
        type: Sequelize.DATE,
        allowNull: false
      },
      monto_mensual: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      monto_deposito: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      monto_administracion: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      renovacion_automatica: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      servicios_incluidos: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      observaciones: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      estado: {
        type: Sequelize.ENUM('activo', 'finalizado', 'cancelado', 'pendiente'),
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

    await queryInterface.addIndex('rentals', ['id_propiedad'], { name: 'rentals_id_propiedad' });
    await queryInterface.addIndex('rentals', ['id_cliente'], { name: 'rentals_id_cliente' });
    await queryInterface.addIndex('rentals', ['estado'], { name: 'rentals_estado' });
    await queryInterface.addIndex('rentals', ['fecha_inicio'], { name: 'rentals_fecha_inicio' });
    await queryInterface.addIndex('rentals', ['fecha_fin'], { name: 'rentals_fecha_fin' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rentals');
  }
};
