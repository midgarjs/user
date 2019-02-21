
module.exports = (sequelize, DataTypes) => {
  /**
   * Acl Model
   */
  const UserAcl = sequelize.define('user_acl', {
    //Path
    rule: {type: DataTypes.STRING, allowNull: false},
    //Allow
    allow: {type: DataTypes.BOOLEAN, allowNull: false},
    //role id
    role_id: {
      type: DataTypes.INTEGER,
    },
  })

  return UserAcl
}