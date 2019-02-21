
const bcrypt = require ('bcrypt')

module.exports = {
  up: async (queryInterface, Sequelize, midgar) => {

    //role model
    const model = midgar.services.db.models.user_role

    //get admin role
    const role = await model.findOne({where: {name: 'Admin'}})

    if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
      throw new Error('Set the ADMIN_EMAIL and ADMIN_PASSWORD env var')
    }

    const password = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 8)
    return queryInterface.bulkInsert('users', [{
      email: process.env.ADMIN_EMAIL, password: password, role_id: role.id, status: 'active'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    if (!process.env.ADMIN_EMAIL) {
      throw new Error('Set the ADMIN_EMAIL env var')
    }

    return queryInterface.bulkDelete('users', {email: process.env.ADMIN_EMAIL}, {});
  }
};