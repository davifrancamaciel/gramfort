'use strict';

const TABLE_NAME = 'sales';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(TABLE_NAME, "lineBreak", { type: Sequelize.TEXT, allowNull: true }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "lineBreak"),      
    ]);
  }
};
