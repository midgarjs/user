const bcrypt = require('bcrypt')

/**
 * Auth
 */
class Auth {
  constructor (midgar, req) {
    this._session = req.session
    /**
     * Logged user
     * @type {User}
     */
    this._user = null

    /**
     * 
     */
    this._acls = null

    /**
     * Logged user role
     * @type {Role}
     */
    this._role = null

    /**
     * Active user status
     * @type {string}
     */
    this._activeStatus = 'active'

    /**
     * Midgar instance
     * @type {midgar}
     */
    this.midgar = midgar

    /**
     * User helper instance
     * @type {UserHelper}
     */
    this._userHelper = this.midgar.services.userHelper
  }

  /**
   * Load the user from the database with the user id in session
   * @param callback
   */
  async getUser () {
    if (this._user) return this._user
    //if nor logged
    if (!this._session.user) return null

    const user = await this._userHelper.get(this._session.user.id, {joinRole: true})

    if (user && user.status == this._activeStatus) {
      this._user = user
      return this._user
    } else {
      return null
    }
  }

  /**
   * Return an array with acls rules of the logged user
   * 
   * @returns Array
   */
  async getAcls() {
    if (this._acls === null) {
      const user = await this.getUser()

      const acls = await user.getAcls()
      this._acls = []
      for (let key in acls) {
        const acl = acls[key]
        this._acls.push(acl.rule)
      }
    }

    return this._acls
  }

  /**
   * Login
   *
   * get the user with the email and check if the password is valid
   * then save the user id in the session
   * @param email
   * @param password
   * @param callback
   */
  async login (email, password) {
    //get user
    const user = await this._userHelper.get(email, {col: 'email'})
    
    //check password
    if (user && user.id && user.status == this._activeStatus && bcrypt.compareSync(password, user.password)) {
      this._session.user = {id: user.id}
      return true
    } else {
      return false
    }
  }
  
  /**
   * Return true if user is logged or false
   * @returns Bool
   */
  async isLogged () {
    if (!this._session.user) return false
    const user = await this.getUser()
    return user && user.status == this._activeStatus
  }

  /**
   * Logout user
   */
  async logout () {
    //remove user from session
    delete this._session.user
    this._session.save()

    //removes user vars
    this._user = null
    this._role = null
    this._acls = null
  }

  /**
   * Return true if the logged user have the acl rul
   * @param {*} rule 
   */
  async isAllow (rule) {
    if (await this.isLogged()) {
      const acls = await this.getAcls()

      for (const key in acls) {
        const acl = acls[key]
        if (acl === 'all' || acl === rule) {
          return true
        }
      }

      return false
    } else {
      return false;
    }
  }
}

/**
 * Auth express middleware
 * 
 * Create an auth instance on each request
 * and atach the instance on the request
 * 
 * @param {*} midgar 
 */
function auth (midgar) {
  return function auth(req, res, next) {
    if (!req.session) {
      throw new Error('Session not defined !')
    }
    // self-awareness
    if (req.auth) {
      next()
      return
    }

    /**
     * Create Auth instance and attache them on the request
     */
    req.auth = new Auth (midgar, req)
      next()
  }
}

module.exports = auth