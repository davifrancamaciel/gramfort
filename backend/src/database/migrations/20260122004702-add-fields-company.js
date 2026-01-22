'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn(TABLE_NAME, "fantasyName", { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "imageHeaderContract", { type: Sequelize.STRING(500), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "imageFooterContract", { type: Sequelize.STRING(500), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "agencyBank", { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "site", { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "instagran", { type: Sequelize.STRING(100), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "cnpj", { type: Sequelize.STRING(50), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "zipCode", { type: Sequelize.STRING(50), allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "currency", { type: Sequelize.STRING(10), allowNull: true }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "fantasyName"),
      await queryInterface.removeColumn(TABLE_NAME, "imageHeaderContract"),
      await queryInterface.removeColumn(TABLE_NAME, "imageFooterContract"),
      await queryInterface.removeColumn(TABLE_NAME, "agencyBank"),
      await queryInterface.removeColumn(TABLE_NAME, "site"),
      await queryInterface.removeColumn(TABLE_NAME, "instagran"),
      await queryInterface.removeColumn(TABLE_NAME, "cnpj"),
      await queryInterface.removeColumn(TABLE_NAME, "zipCode"),
      await queryInterface.removeColumn(TABLE_NAME, "currency"),
    ]);
  }
};
