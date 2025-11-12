'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {

      queryInterface.addColumn('sales', "invoice", { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
      queryInterface.addColumn('sales', "demand", { type: Sequelize.STRING(30), });
      queryInterface.addColumn('users', "nature", { type: Sequelize.STRING(30), });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('sales', "invoice"),
      queryInterface.removeColumn('sales', "demand"),
      queryInterface.removeColumn('users', "nature"),
    ]);
  },
};