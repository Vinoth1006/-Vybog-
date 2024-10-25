module.exports = (sequelize, DataTypes) => {
    const teamManagement = sequelize.define('teamManagement', {
      id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
      },
      teamName: {
        type: DataTypes.STRING,
      },
      members: {
        type: DataTypes.STRING,
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
  
    return teamManagement;
  };