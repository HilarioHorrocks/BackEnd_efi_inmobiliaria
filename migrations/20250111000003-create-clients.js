'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('clients'));
    
    if (tableExists) {
      console.log('Table clients already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      documento_identidad: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      direccion: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      fecha_nacimiento: {
        type: Sequelize.DATE,
        allowNull: true
      },
      profesion: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      estado_civil: {
        type: Sequelize.ENUM('soltero', 'soltera', 'casado', 'casada', 'divorciado', 'divorciada', 'viudo', 'viuda', 'union_libre'),
        allowNull: true
      },
      ingresos_mensuales: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: true
      },
      preferencias: {
        type: Sequelize.JSON,
        allowNull: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('clients', ['documento_identidad'], {
      unique: true,
      name: 'clients_documento_identidad'
    });
    await queryInterface.addIndex('clients', ['id_usuario'], {
      unique: true,
      name: 'clients_id_usuario'
    });
    await queryInterface.addIndex('clients', ['telefono'], { name: 'clients_telefono' });
    await queryInterface.addIndex('clients', ['profesion'], { name: 'clients_profesion' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('clients');
  }
};
