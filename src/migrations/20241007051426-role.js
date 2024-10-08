'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'role', {
      type: Sequelize.ENUM,
      values: ['admin', 'user'], // Add all your enum values here
      allowNull: false,
      defaultValue: 'user' // Set default role if necessary
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'role');
  }
};
