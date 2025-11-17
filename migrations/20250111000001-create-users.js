'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Verificar si la tabla ya existe
    const tableExists = await queryInterface.showAllTables()
      .then(tables => tables.includes('users'));
    
    if (tableExists) {
      console.log('Table users already exists, skipping creation');
      return;
    }

    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      correo: {
        type: Sequelize.STRING(150),
        allowNull: false,
        unique: true
      },
      contraseña: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      rol: {
        type: Sequelize.ENUM('admin', 'agente', 'cliente'),
        allowNull: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      telefono: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      reset_token: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      reset_token_expiry: {
        type: Sequelize.DATE,
        allowNull: true
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

    await queryInterface.addIndex('users', ['correo'], {
      unique: true,
      name: 'users_correo'
    });
    await queryInterface.addIndex('users', ['rol'], {
      name: 'users_rol'
    });
    await queryInterface.addIndex('users', ['is_active'], {
      name: 'users_is_active'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};
