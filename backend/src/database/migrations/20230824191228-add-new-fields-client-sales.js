'use strict';

const { userType } = require("../../utils/defaultValues");

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('expenses', "saleId", {
        type: Sequelize.INTEGER,
        references: { model: 'sales', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
      queryInterface.addColumn('sales', "clientId", {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
      }),

    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('expenses', "saleId"),
      queryInterface.removeColumn('sales', "clientId"),
    ]);
  },
};