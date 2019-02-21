
const bcrypt = require ('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize, midgar) => {
    return
    const model = midgar.services.db.models.user_role
    
    //get admin role
    const role = await model.findOne({where: {name: 'Admin'}})

    const password = bcrypt.hashSync("xxxxxxxxx", 8)
    const users = []
    for (let i=0;i < 1000;i++) {
      users.push({
        email:  'test ' + i + '@test.com', password: password, role_id: role.id, status: 'activated'
      })
    }
    return queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {

  }
};