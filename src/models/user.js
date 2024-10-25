module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
      },
    tenant_id: {
      type: DataTypes.INTEGER,
    },
    role_id: {
      type: DataTypes.INTEGER,
    },
    first_name: {
      type: DataTypes.STRING
    },
    last_name: {
      type: DataTypes.STRING
    },
    user_name: {
      type: DataTypes.STRING
    },
    password: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    createdBy: {
      type: DataTypes.INTEGER,
    },
    updatedBy: {
        type: DataTypes.INTEGER
    },
    createdAt: {
        type: DataTypes.DATE,
    },
    updatedAt: {
        type: DataTypes.DATE,
    },
    status: {
      defaultValue:1,
      type:DataTypes.INTEGER
    }
  }, {
    freezeTableName: true, 
  });

  user.associate = function(models){
    user.hasMany(models.tenant, {
      foreignKey: "tenant_id",
      as: "id_tenant"
    });
    user.hasMany(models.role, {
      foreignKey: "role_id",
      as: "id_role"
    });
  } 
  
  return user;
};