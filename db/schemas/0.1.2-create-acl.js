'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user_acls', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'user_roles',
          key: 'id'
        },
      },
      rule: {
        type: Sequelize.STRING,
        allowNull: false
      },
      allow: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_acls');
  }
};