module.exports = (sequelize, DataTypes) => {
    const lookup_value = sequelize.define('lookup_value', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        lookup_id: {
            type: DataTypes.INTEGER,
            comment: "lookup"
        },
        parent_id: {
            type: DataTypes.INTEGER
        },
        org_id :{
            type: DataTypes.INTEGER
        },
        lookup_value_code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING
        },
        seq: {
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

    return lookup_value;
};