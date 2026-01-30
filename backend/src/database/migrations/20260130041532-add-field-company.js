'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn(TABLE_NAME, "textclauseContract2", { type: Sequelize.TEXT, allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "textclauseContract3", { type: Sequelize.TEXT, allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "textclauseContract4", { type: Sequelize.TEXT, allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "textVisit", { type: Sequelize.TEXT, allowNull: true }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "textclauseContract2"),
      await queryInterface.removeColumn(TABLE_NAME, "textclauseContract2"),
      await queryInterface.removeColumn(TABLE_NAME, "textclauseContract4"),
      await queryInterface.removeColumn(TABLE_NAME, "textVisit"),

    ]);
  }
};
