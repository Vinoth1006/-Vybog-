module.exports = (sequelize, DataTypes) => {
    const client = sequelize.define('client', {
      id: {
        allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
      },
      company_name: {
        type: DataTypes.STRING,
      },
      company_tax: {
        type: DataTypes.STRING,
      },
      company_agreement: {
        type: DataTypes.STRING
      },
      company_tier: {
        type: DataTypes.STRING
      },
      payment_terms: {
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
  
    return client;
  };