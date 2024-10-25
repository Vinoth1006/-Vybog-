module.exports = (sequelize, DataTypes) => {
    const requirementPlan = sequelize.define('requirement_plan', {
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
        plan :{
            type: DataTypes.STRING,
            comment: "lookup"
        },
        plan_type: {
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

    requirementPlan.associate = function (models) {
        requirementPlan.belongsTo(models.requirement, {
            foreignKey: 'requirement_id',
            as: 'requirement'
        });
        requirementPlan.belongsTo(models.user, {
            foreignKey: "created_by",
            as: "user"
        });
    }

    return requirementPlan;
};