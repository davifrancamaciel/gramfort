'use strict';

const TABLE_NAME = 'products';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn(TABLE_NAME, "kgPerTank", { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "m2PerTank", { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "bag", { type: Sequelize.INTEGER, defaultValue: 0 }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "kgPerTank"),
      await queryInterface.removeColumn(TABLE_NAME, "m2PerTank"),
      await queryInterface.removeColumn(TABLE_NAME, "bag"),
    ]);
  },
};