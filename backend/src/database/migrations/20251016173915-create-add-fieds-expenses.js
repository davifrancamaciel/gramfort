'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('expenses', "vehicleId", {
        type: Sequelize.INTEGER,
        references: { model: 'vehicles', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
      }),
      queryInterface.addColumn('expenses', "supplierId", {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
      }),
      queryInterface.addColumn('expenses', "paymentMethod", { type: Sequelize.STRING(50), }),
      queryInterface.addColumn('expenses', "amount", { type: Sequelize.DECIMAL(15, 2), defaultValue: 0 }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('expenses', "vehicleId"),
      queryInterface.removeColumn('expenses', "supplierId"),
      queryInterface.removeColumn('expenses', "paymentMethod"),
      queryInterface.removeColumn('expenses', "amount"),
    ]);
  },
};