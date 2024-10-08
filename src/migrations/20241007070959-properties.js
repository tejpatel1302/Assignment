'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
   await queryInterface.addColumn('Sales', 'saleAmount', {
      type: Sequelize.DECIMAL(10, 2), // Sale price
      allowNull: false,
    });

    await queryInterface.addColumn('Sales', 'costPrice', {
      type: Sequelize.DECIMAL(10, 2), // Cost price of the product
      allowNull: false,
    });

    await queryInterface.addColumn('Sales', 'profit', {
      type: Sequelize.DECIMAL(10, 2), // Calculated profit (saleAmount - costPrice)
      allowNull: false,
    });

    await queryInterface.addColumn('Sales', 'saleCategory', {
      type: Sequelize.STRING, // Optional category field for sale
      allowNull: true,
    });

    await queryInterface.addColumn('Sales', 'saleDate', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW, // Automatically sets the date of sale
    });

    await queryInterface.addColumn('Sales', 'userId', {
      type: Sequelize.UUID, // Foreign key linking to the User
      allowNull: false,
      references: {
        model: 'Users', // References the User model
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Sales', 'status');
    await queryInterface.removeColumn('Sales', 'saleAmount');
    await queryInterface.removeColumn('Sales', 'costPrice');
    await queryInterface.removeColumn('Sales', 'profit');
    await queryInterface.removeColumn('Sales', 'saleCategory');
    await queryInterface.removeColumn('Sales', 'saleDate');
    await queryInterface.removeColumn('Sales', 'userId');
  }
};
