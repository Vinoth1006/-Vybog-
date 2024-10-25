module.exports = (sequelize, DataTypes) => {
  const manageOps = sequelize.define('manage_ops', {
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
    plan_type: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    req_type: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    case_id: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    team: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    user_id: {
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
  
  return manageOps;
};