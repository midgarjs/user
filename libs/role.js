const utils = require('@midgar/utils')
const Sequelize = require('sequelize')

/**
 * Role helper class
 */
class RoleHelper {
  constructor(midgar) {
    this.midgar = midgar
    this._roleModel = this.midgar.services.db.models.user_role
    this._aclModel = this.midgar.services.db.models.user_acl
  }

  /**
   * Return a role from db
   * if joinAcl is true join the acl table
   * 
   * @param {int}     id      role id
   * @param {boolean} joinAcl join acl table
   */
  get(value,  options = {
      col: 'id',
      joinAcl: false
    }) {


    const query = {}
    
    if (!options.col) {
      options.col = 'id'
    } 

    //set where condition
    query.where = {}
    query.where[options.col] = {[Sequelize.Op.eq]: value}

    //join role
    if (options.joinAcl) {
      query.include =  [
        {
          model: this._aclModel,
          as: 'acls',
          attributes: ['id', 'role_id', 'rule', 'allow']
        }
      ]
    }

    //get the user from db
    return this._roleModel.findOne(query)
  }

  /**
   * Delete role
   * 
   * @param {int} id role id 
   */
  delete(id) {
    return this._roleModel.destroy({
      where: {id: id},
    })
  }

  /**
   * Create a role in db
   * 
   * @param {*} params 
   */
  async create(params) {
    if (!params.name) throw new Error('no name')

    const role = await this._roleModel.create({name: params.name})

    if (params.acls) {
      this._updateAcl(role, params.acls)
    }

    return role
  }

  /**
   * Update role acl in database
   * @param {*} role 
   * @param {*} rules
   * @private
   */
  async _updateAcl(role, rules) {
    let aclRules = []
    if (role.acls) {
      //search rules to delete and return only rules to keep
      aclRules = await utils.asyncMap(role.acls, acl => {
        //if rule is removed
        if (rules.indexOf('all') !== -1 && acl.rule != 'all' || rules.indexOf(acl.rule) === -1) {
          acl.destroy()
        } else {
          return acl.rule
        }
      })
    } else {
      role.acls = []
    }

    //create new rules
    await utils.asyncMap(rules, async rule => {
      if (aclRules.indexOf(rule) === -1) {
        let acl = await this._aclModel.create({role_id: role.id, rule, allow: 1})
        role.acls.push(acl)
      }
    })
  }

  /**
   * Update role in db then update acl rules
   * @param {*} role 
   * @param {*} params 
   */
  async update(role, params) {
    if (!params.name) throw new Error('no name')
    
    await this._roleModel.update({name: params.name}, {where: {id: role.id}})
    if (params.acls) {
      this._updateAcl(role, params.acls)
    }
  }

  /**
   * Return options array for roles
   * @return Array
   */
  async getRoleOptions() {
    const result = await this._roleModel.findAll()
    const options = []
    for (const key in result) {
      options.push({label: result[key].name, value: result[key].id})
    }

    return options
  }

  /**
   * Return true if the role exist
   * @param {*} id
   * @return {boolean} 
   */
  async existRole(id) {
    const count = await this._roleModel.count({where: { id: {[Sequelize.Op.eq]: id} } })
    return count > 0
  }
}

module.exports = RoleHelper