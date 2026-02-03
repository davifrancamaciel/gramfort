'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(TABLE_NAME, "directorName", { type: Sequelize.STRING(50), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "imageSignature", { type: Sequelize.STRING(500), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "companiesIds", { type: Sequelize.JSON, allowNull: true }, { transaction });


      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "directorName"),
      await queryInterface.removeColumn(TABLE_NAME, "imageSignature"),
      await queryInterface.removeColumn(TABLE_NAME, "companiesIds"),
    ]);
  }
};
