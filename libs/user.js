const bcrypt = require ('bcrypt')
const Sequelize = require('sequelize')
const utils = require('@midgar/utils')
/**
 * User helper class
 */
class UserHelper {
  constructor(midgar) {
    this.midgar = midgar
    this._userModel = this.midgar.services.db.models.user
    this.roleModel = this.midgar.services.db.models.user_role

    /**
     * status array
     */
    this._status = null
  }

  /**
   * Return user status array
   * @return {Array}
   */
  async getStatus() {
    if (this._status === null)
      this._status = await this._getStatus()

    return this._status
  }

  /**
   * get user status from plugins config
   */
  async _getStatus() {
    const status = []
    //list plugins async
    await utils.asyncMap(this.midgar.pm.plugins, async plugin => {
      //if plugin have user status config
      if (plugin.config && plugin.config.user && plugin.config.user.status) {
        for (const key in plugin.config.user.status) {
          const _status = plugin.config.user.status[key]
          status.push({code: _status.code, label: _status.label, translate: _status.translate ? _status.translate : true})
        }
      }
    })

    return status
  }

  /**
   * Create a user
   * 
   * @param {*} params 
   */
  async create(params) {
    if (!params.email) throw new Error('no email')
    if (!params.password) throw new Error('no password')
    if (!params.role_id) throw new Error('no role_id')
    if (!params.status) throw new Error('no status')

    params.password = bcrypt.hashSync(params.password, 8)

    //get the user from db
    const user = await this._userModel.create(params)
    const mailer = this.midgar.services.mailer
    // setup email data with unicode symbols
    let mailOptions = {
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: params.email,
      subject: 'Hello world', // Subject line
  //   text: 'Hello world', // plain text body
      html: '<b>Hello world?</b>' // html body
    };

    // send mail with defined transport object
    const result = await mailer.sendMail(mailOptions)
    console.log(result)
  }

  async update(user, params) {

  if (params.password) 
    params.password = bcrypt.hashSync(params.password, 8)

    await this._userModel.update(params, {where: {id: user.id}})
  }

  /**
   * Delete user
   * 
   * @param {int} id user id 
   */
  delete(id) {
    return this._userModel.destroy({
      where: {id: id},
    })
  }

  /**
   * Return a user from db
   * if joinRole is true join the role table
   * 
   * @param {int}     value       user id
   * @param {boolean} options join role table
   */
  get(value, options = {
      col: 'id',
      joinRole: false
    }) {


    const query = {}
    
    //set default col
    if (!options.col) {
      options.col = 'id'
    } 

    //set where condition
    query.where = {}
    query.where[options.col] = {[Sequelize.Op.eq]: value}

    //join role
    if (options.joinRole) {
      query.include = [
        {
          model: this.roleModel,
          as: 'role',
          attributes: ['name'],
          required: true
        }
      ]
    }

    //get the user from db
    return this._userModel.findOne(query)
  }

  /**
   * Return true if user exits with email adress in db
   * 
   * @param {string} email           User email
   * @param {Object} options         Options
   * @param {int}    options.exclude Exclude user id
   * 
   * @return {boolean}
   */
  async existEmail(email, options = {}) {
    //count query
    const query = {
      where: { 
        email: {
          [Sequelize.Op.eq]: email
        } 
      }
    }

    //exclude id
    if (options.exclude) {
      query.where.id = {
        [Sequelize.Op.ne]: options.exclude
      }
    }

    const count = await this._userModel.count(query)
    return count > 0
  }


  /**
   * Return options array for roles
   * 
   * @return Array
   */
  async getStatusOptions() {
    const status = await this.getStatus()
    const options = []
    for (const key in status) {
      options.push({label: status[key].label, value: status[key].code, translate: status[key].translate})
    }

    return options
  }
}

module.exports = UserHelper
