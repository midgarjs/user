const Plugin = require('@midgar/midgar/plugin')
const auth = require('./libs/auth')
const UserHelper = require('./libs/user')
const RoleHelper = require('./libs/role')

/**
 * MidgarUser plugin
 */
class MidgarUser extends Plugin {

  /**
   * Init plugin
   */
  async init() {
    this.pm.on('@midgar/db:afterSequelizeInit', async args => {
      //set helpers
      this.userHelper = new UserHelper(this.midgar)
      this.roleHelper = new RoleHelper(this.midgar)
      this.midgar.services.userHelper = this.userHelper
      this.midgar.services.roleHelper = this.roleHelper
    })

    //add route check
   /* this.pm.on('@midgar/route-loader:beforeCallRoute', async (args) => {
      await this._beforeCallRoute(args.route, args.router, args.req, args.res, args.next)
    })*/

    //add auth middleware
    this.pm.on('@midgar/session:afterInit', async () => {
      await this._afterInitSession()
    })
    
  }

  /**
   * Add auth middleware after session init
   */
  async _afterInitSession() {
    this.midgar.app.use(auth(this.midgar))
  }

  /**
   * Before exec route event callback
   * 
   * @param {Object} route 
   * @param {Object} req 
   * @param {Object} res 
   * @param {function} next 
   */
  async _beforeCallRoute(route, router, req, res, next) {
    //console.log('check route')
    //console.log(route)
    const isLogged = await req.auth.isLogged()
    //check login
    if (route.logged && isLogged) {
      route.isAllow = false
      res.status(403).redirect(route.logged)
      //check no logged
    } else if (route.notLogged && !isLogged) {
      route.isAllow = false
      res.status(403).redirect(route.notLogged)
      //check acl
    } else if (route.acl) {
      const isAllow = await req.auth.isAllow(route.acl)
      if (!isAllow) {
        route.isAllow = false
        this.midgar.emit('error-403', req, res)
      }
    }
  }
}

module.exports = MidgarUser
