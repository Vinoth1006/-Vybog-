module.exports = (sequelize, DataTypes) => {
  const requirementProcedureLimit = sequelize.define('requirement_procedure_limit', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    requirement_id: {
      type: DataTypes.INTEGER
    },
    type: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    count: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    unit: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    period: {
      type: DataTypes.STRING,
      comment: "lookup"
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
  
  return requirementProcedureLimit;
};