'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcrypt');
const { ServerConfig } = require('../config');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4, // Auto-generate UUID
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('active', 'suspended', 'deleted'), // Enum values
      allowNull: false,  // Field cannot be null
      defaultValue: 'active'  // Set the default value
    },
    role: {
      type: DataTypes.ENUM('admin', 'user'), // Enum values
      allowNull: false,  // Field cannot be null
      defaultValue: 'user'  // Set the default value
    },
    commissionRate: {
      type: DataTypes.DECIMAL(5, 2),  // Commission rate for users, 20%
      defaultValue: 20.00,
    },
    deletedAt: {
      type: DataTypes.DATE,  // Add this line for soft deletes
      allowNull: true
  },
   refreshToken: { // Ensure this field exists
    type: DataTypes.STRING,
    allowNull: true, // Adjust as necessary
},

  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(function encrypt(user) {
    const encryptedPassword = bcrypt.hashSync(user.password, +ServerConfig.SALT_ROUNDS);
    user.password = encryptedPassword;
  });
  return User;
};