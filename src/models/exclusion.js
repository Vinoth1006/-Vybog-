module.exports = (sequelize, DataTypes) => {
    const exclusion = sequelize.define('exclusion', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        plan: {
            type: DataTypes.STRING,
            comment: "lookup"
        },
        state :{
            type: DataTypes.STRING,
            comment: "lookup"
        },
        plan_type :{
            type: DataTypes.STRING,
            comment: "lookup"
        },
        service_category :{
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

    return exclusion;
};