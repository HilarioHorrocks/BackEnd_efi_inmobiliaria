'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('properties'));
    
    if (tableExists) {
      console.log('Table properties already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      tipo: {
        type: Sequelize.ENUM('casa', 'departamento', 'terreno', 'local', 'oficina'),
        allowNull: false
      },
      precio: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },
      estado: {
        type: Sequelize.ENUM('disponible', 'vendida', 'alquilada'),
        defaultValue: 'disponible'
      },
      disponibilidad: {
        type: Sequelize.ENUM('venta', 'alquiler', 'ambos'),
        defaultValue: 'ambos'
      },
      descripcion: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tamano: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      habitaciones: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      banos: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      garajes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      ciudad: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      codigo_postal: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      imagenes: {
        type: Sequelize.JSON,
        allowNull: true
      },
      caracteristicas: {
        type: Sequelize.JSON,
        allowNull: true
      },
      id_agente: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('properties', ['tipo'], { name: 'properties_tipo' });
    await queryInterface.addIndex('properties', ['estado'], { name: 'properties_estado' });
    await queryInterface.addIndex('properties', ['precio'], { name: 'properties_precio' });
    await queryInterface.addIndex('properties', ['ciudad'], { name: 'properties_ciudad' });
    await queryInterface.addIndex('properties', ['id_agente'], { name: 'properties_id_agente' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('properties');
  }
};
