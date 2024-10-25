module.exports = (sequelize, DataTypes) => {
    const waiver = sequelize.define('waiver', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        provider_id: {
            type: DataTypes.INTEGER
        },
        network :{
            type: DataTypes.STRING,
            comment: "lookup"
        },
        waiver_program :{
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

    return waiver;
};