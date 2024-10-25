module.exports = (sequelize, DataTypes) => {
    const requirement_state = sequelize.define('requirement_state', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        requirement_id :{
            type: DataTypes.INTEGER
        },
        code_id :{
            type: DataTypes.INTEGER
        },
        state: {
            type: DataTypes.STRING,
            comment: "lookup"
        },
        is_include: {
            type: DataTypes.BOOLEAN
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

    return requirement_state;
};