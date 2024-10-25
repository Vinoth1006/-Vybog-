module.exports = (sequelize, DataTypes) => {
  const paRequest = sequelize.define('pa_request', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    member_id: {
      type: DataTypes.INTEGER
    },
    provider_id: {
      type: DataTypes.INTEGER
    },
    refering_provider_id: {
      type: DataTypes.INTEGER
    },
    condition: {
      type: DataTypes.JSON
    },
    procedure:{
      type: DataTypes.JSON
    },
    question_id:{
      type: DataTypes.JSON
    },
    status_id:{
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
  
  return paRequest;
};