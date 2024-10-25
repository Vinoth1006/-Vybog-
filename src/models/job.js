module.exports = (sequelize, DataTypes) => {
  const job = sequelize.define('job', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
      },
    tenant_id: {
      type: DataTypes.INTEGER,
    },
    // role_id: {
    //   type: DataTypes.INTEGER,
    // },
    job_title: {
      type: DataTypes.STRING
    },
    no_of_opening: {
      type: DataTypes.INTEGER
    },
    job_code: {
      type: DataTypes.STRING,
      defaultValue: true
    },
    client: {
      type: DataTypes.STRING,
      defaultValue: true
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

  // user.associate = function(models){
  //   user.hasMany(models.tenant, {
  //     foreignKey: "tenant_id",
  //     as: "id_tenant"
  //   });
  //   user.hasMany(models.role, {
  //     foreignKey: "role_id",
  //     as: "id_role"
  //   });
  // } 
  
  return job;
};