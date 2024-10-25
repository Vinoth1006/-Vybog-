module.exports = (sequelize, DataTypes) => {
    const question = sequelize.define('question', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        question_code: {
            type: DataTypes.STRING
        },
        question_group :{
            type: DataTypes.STRING,
            comment: "lookup"
        },
        code_id :{
            type: DataTypes.INTEGER
        },
        name: {
            type: DataTypes.STRING
        },
        description :{
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

    return question;
};