module.exports = (sequelize, DataTypes) => {
  const fileUpload = sequelize.define('file_upload', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    org_id: {
      type: DataTypes.INTEGER
    },
    fk_id: {
      type: DataTypes.INTEGER
    },
    location_url: {
      type: DataTypes.STRING
    },
    original_file_name:{
      type: DataTypes.STRING
    },
    mime_type:{
      type: DataTypes.STRING
    },
    upload_type:{
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
  
  return fileUpload;
};