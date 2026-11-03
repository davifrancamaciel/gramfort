'use strict';

const TABLE_NAME = 'sales';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(TABLE_NAME, "purpose", { type: Sequelize.STRING(100), allowNull: true }, { transaction });//Finalidade
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "purpose"),
    ]);
  }
};
