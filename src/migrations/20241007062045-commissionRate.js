'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'commissionRate', {
      type: Sequelize.DECIMAL(5, 2), // Precision and scale: 5 total digits, 2 after the decimal
    allowNull: true,              // Allow NULL values
    defaultValue: 20.00             // Default value for the new column

     
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'commissionRate');
  }
};
