module.exports = (sequelize, DataTypes) => {
    const exclusion_code = sequelize.define('exclusion_code', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        exclusion_id: {
            type: DataTypes.INTEGER
        },
        code_id :{
            type: DataTypes.INTEGER
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

    return exclusion_code;
};