module.exports = (sequelize, DataTypes) => {
  const UserRole = sequelize.define('user_role', {
    name: {type: DataTypes.STRING, allowNull: false},
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

  UserRole.associate = function (models) {
    UserRole.hasMany(models.user_acl, {as: 'acls', foreignKey: 'role_id'})
  }

  return UserRole
}