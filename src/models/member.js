module.exports = (sequelize, DataTypes) => {
  const member = sequelize.define('member', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    member_group_id: {
      type: DataTypes.STRING,
      comment: "lookup"
    },
    code_id: {
      type: DataTypes.INTEGER
    },
    name: {
      type: DataTypes.STRING
    },
    dob: {
      type: DataTypes.DATE
    },
    eligibity_date: {
      type: DataTypes.DATE
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
  
  return member;
};