module.exports = (sequelize, DataTypes) => {
    const response_list = sequelize.define('response_list', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        question_id: {
            type: DataTypes.INTEGER
        },
        response_group :{
            type: DataTypes.STRING,
            comment: "lookup"
        },
        options :{
            type: DataTypes.STRING
        },
        response_type: {
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

    return response_list;
};