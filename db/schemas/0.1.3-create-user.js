'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'user_roles',
          key: 'id'
        },
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });

    await queryInterface.addIndex('users', ['email'])
    await queryInterface.addIndex('users', ['status'])
    await queryInterface.addIndex('users', ['created_at'])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};