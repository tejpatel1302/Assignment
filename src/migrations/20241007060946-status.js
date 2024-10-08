'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.ENUM('active', 'suspended', 'deleted'), // Enum values
      allowNull: false,
      defaultValue: 'active', // Default value for the new column

     
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'status');
  }
};
