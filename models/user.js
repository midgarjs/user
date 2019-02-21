module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role_id: {
      allowNull: false,
      type: DataTypes.INTEGER, 
      references: {
        model: 'user_roles',
        key: 'id',
      },
    },
    status: {type: DataTypes.STRING, allowNull: false},
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      timestamps: true,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      timestamps: true,
      defaultValue: DataTypes.NOW
    },
  })

  User.associate = function (models) {
    User.belongsTo(models.user_role, {as: 'role', foreignKey: 'role_id'})
    User.hasMany(models.user_acl,
      {as: 'acls', sourceKey: 'role_id', foreignKey: 'role_id'})
    //User.hasOne(models.user_role, {foreignKey: 'role_id'})
  }
  
  return User
}