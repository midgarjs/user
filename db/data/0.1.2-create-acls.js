
module.exports = {
  up: async (queryInterface, Sequelize, midgar) => {

    const model = midgar.services.db.models.user_role
    //get admin role
    const role = await model.findOne({where: {name: 'Admin'}})
    
    //add all acl to admin role
    return queryInterface.bulkInsert('user_acls', [{
      rule: 'all', allow: true, role_id: role.id,
    }], {});
  },

  down: async (queryInterface, Sequelize, midgar) => {
    const model = midgar.services.db.models.user_role
    //get admin role
    const role = await model.findOne({where: {name: 'Admin'}})
    const adminId = role.id

    return queryInterface.bulkDelete('user_acls', {role_id: adminId}, {});
  }
};