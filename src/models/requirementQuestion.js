module.exports = (sequelize, DataTypes) => {
  const requirementQuestion = sequelize.define('requirement_question', {
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
    question_id: {
      type: DataTypes.INTEGER
    },
    response_list_id: {
      type: DataTypes.INTEGER
    },
    min_range: {
      type: DataTypes.STRING
    },
    max_range: {
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
  
  return requirementQuestion;
};