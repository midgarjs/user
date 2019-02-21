module.exports = {
  up: (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()')
      }
    },
    {
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });

    await queryInterface.addIndex('user_roles', ['name'])
    await queryInterface.addIndex('user_roles', ['created_at'])
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user_roles')
  }
}