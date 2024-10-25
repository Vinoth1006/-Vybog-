module.exports = (sequelize, DataTypes) => {
  const userAccess = sequelize.define('user_access', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    user_id: {
      type: DataTypes.INTEGER
    },
    access_level: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    team: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    avaliablity: {
      type: DataTypes.JSON
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
  
  return userAccess;
};