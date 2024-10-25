module.exports = (sequelize, DataTypes) => {
    const activityLog = sequelize.define('activity_log', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        pa_request_id: {
            type: DataTypes.INTEGER
        },
        status: {
            type: DataTypes.STRING,
            comment: "lookup"
        },
        note: {
            type: DataTypes.STRING
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
  
    return activityLog;
};