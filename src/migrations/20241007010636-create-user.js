'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
    
      id: {
        type: Sequelize.UUID,   // Use UUID for unique user IDs
        defaultValue: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,          // Ensure email is unique
        validate: {
          isEmail: true,       // Validate the format of the email
        }
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      // role: {
      //   type: Sequelize.ENUM('user', 'admin'),  // Role can be 'user' or 'admin'
      //   defaultValue: 'user',
      // },
      // status: {
      //   type: Sequelize.ENUM('active', 'suspended', 'deleted'),  // Status field
      //   defaultValue: 'active',
      // },
      // commissionRate: {
      //   type: Sequelize.DECIMAL(5, 2),  // Commission rate for users, 20%
      //   defaultValue: 20.00,
      // },
    }, {
      timestamps: true,  // Automatically adds 'createdAt' and 'updatedAt'
      paranoid: true,    // Enables soft deletes (deletes will not be permanent), 
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};