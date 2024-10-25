module.exports = (sequelize, DataTypes) => {
    const lookup = sequelize.define('lookup', {
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
        code: {
            type: DataTypes.STRING,
            allowNull: false,
            uniqueKey: true
        },
        description: {
            type: DataTypes.STRING
        },
        seq :{
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

    return lookup;
};