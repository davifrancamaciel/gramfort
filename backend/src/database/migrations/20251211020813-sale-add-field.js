'use strict';

const TABLE_NAME = 'sales';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn(TABLE_NAME, "valuePerMeter", { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "valuePerMeter"),
    ]);
  },
};