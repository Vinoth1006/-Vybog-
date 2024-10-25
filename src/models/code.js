module.exports = (sequelize, DataTypes) => {
    const code = sequelize.define('code', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        parent_id :{
            type: DataTypes.INTEGER
        },
        code_type: {
            type: DataTypes.STRING,
            comment: "lookup"
        },
        name :{
            type: DataTypes.STRING
        },
        description: {
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

    return code;
};