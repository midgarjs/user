
module.exports = {
  up: async (queryInterface, Sequelize, midgar) => {
    await queryInterface.bulkInsert('user_roles', [
      {
        name: 'Admin',
      }, {
        name: 'Utilisateur',
      }], {})

      const model = midgar.services.db.models.user_role

      //get User role
      const role = await model.findOne({where: {name: 'Utilisateur'}})

      //set default role
      midgar.services.dbConfig.set('user.default-role', role.id)
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user_roles', {[Sequelize.Op.or]: [{name: 'Admin'}, {name: 'Utilisateur'}]}, {})
    await queryInterface.bulkDelete('config', {code: 'user.default-role'})
  }
}