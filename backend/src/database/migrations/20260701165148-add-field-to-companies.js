'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(TABLE_NAME, "kgDiscartPerTank", {
        type: Sequelize.DECIMAL(15, 5), allowNull: false, defaultValue: 0
      }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "kgInputPerTank", {
        type: Sequelize.DECIMAL(15, 5), allowNull: false, defaultValue: 0
      }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "kgSeedPerTank", {
        type: Sequelize.DECIMAL(15, 5), allowNull: false, defaultValue: 0
      }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "kgDiscartPerTank"),
      await queryInterface.removeColumn(TABLE_NAME, "kgInputPerTank"),
      await queryInterface.removeColumn(TABLE_NAME, "kgSeedPerTank"),
    ]);
  }
};
