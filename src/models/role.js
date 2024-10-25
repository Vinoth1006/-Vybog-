module.exports = (sequelize, DataTypes) => {
  const role = sequelize.define('role', {
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
    role_name: {
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
  
  return role;
};