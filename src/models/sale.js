'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sale extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      Sale.belongsTo(models.User, {
        foreignKey: 'userId', // Foreign key in the Sale model
        as: 'user', // Alias for the association
      });
    }
  }

  Sale.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false, // Set as needed
    },
    
    saleAmount: {
      type: DataTypes.DECIMAL(10, 2), // Sale price
      allowNull: false,
    },
    costPrice: {
      type: DataTypes.DECIMAL(10, 2), // Cost price of the product
      allowNull: false,
    },
    profit: {
      type: DataTypes.DECIMAL(10, 2), // Calculated profit (saleAmount - costPrice)
      allowNull: false,
    },
    saleCategory: {
      type: DataTypes.STRING, // Optional category field for sale
      allowNull: true,
    },
    saleDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW, // Automatically sets the date of sale
    },
    userId: {
      type: DataTypes.UUID, // Foreign key linking to the User
      allowNull: false,
      references: {
        model: 'Users', // References the User model
        key: 'id',
      },
    },
  }, {
    sequelize,
    modelName: 'Sale',
  });

  return Sale;
};
