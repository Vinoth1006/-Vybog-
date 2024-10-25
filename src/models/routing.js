module.exports = (sequelize, DataTypes) => {
  const routing = sequelize.define('routing', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    service_category: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    state: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    site: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    plan: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    plan_type: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    req_type: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    team: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    code_id: {
      type: DataTypes.INTEGER
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
  
  return routing;
};