module.exports = (sequelize, DataTypes) => {
    const requirement = sequelize.define('requirement', {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        org_id: {
            type: DataTypes.INTEGER
        },
        service_category: {
            type: DataTypes.STRING,
            comment: "lookup"
        },
        code_id :{
            type: DataTypes.INTEGER
        },
        auto_processing: {
            type: DataTypes.BOOLEAN
        },
        expedited_processing_request: {
            type: DataTypes.BOOLEAN
        },
        patient_initiated_pa: {
            type: DataTypes.BOOLEAN
        },
        additional_clinical_info: {
            type: DataTypes.BOOLEAN
        },
        support_document_submit_request: {
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

    requirement.associate = function (models) {
        requirement.hasMany(models.requirement_plan, {
            foreignKey: 'requirement_id',
            as: 'requirementPlan'
        });
        requirement.belongsTo(models.user, {
            foreignKey: "created_by",
            as: "user"
        });
    }

    return requirement;
};