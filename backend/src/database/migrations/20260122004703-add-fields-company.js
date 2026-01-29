'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn(TABLE_NAME, "financeName", { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "financePhone", { type: Sequelize.STRING(20), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "sizeTank", { type: Sequelize.INTEGER, defaultValue: 250 }, { transaction });


      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "financeName"),
      await queryInterface.removeColumn(TABLE_NAME, "financePhone"),
      await queryInterface.removeColumn(TABLE_NAME, "sizeTank"),

    ]);
  }
};
