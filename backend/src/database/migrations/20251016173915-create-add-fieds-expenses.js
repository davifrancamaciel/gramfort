'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('expenses', "vehicleId", {
        type: Sequelize.INTEGER,
        references: { model: 'vehicles', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }),
    ]);
  },
  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('expenses', "vehicleId"),     
    ]);
  },
};