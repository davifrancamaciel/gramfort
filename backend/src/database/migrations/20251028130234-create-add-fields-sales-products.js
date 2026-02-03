'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {

      await queryInterface.addColumn('sales', "valueInput", { type: Sequelize.DECIMAL(15, 2), defaultValue: 0 }, { transaction });
      await queryInterface.addColumn('sales', "contact", { type: Sequelize.STRING(100), }, { transaction });
      await queryInterface.addColumn('sales', "capture", { type: Sequelize.STRING(30), }, { transaction });
      await queryInterface.addColumn('sales', "nature", { type: Sequelize.STRING(30), }, { transaction });
      await queryInterface.addColumn('sales', "distance", { type: Sequelize.INTEGER, }, { transaction });
      await queryInterface.addColumn('sales', "satisfaction", { type: Sequelize.INTEGER, }, { transaction });
      await queryInterface.addColumn('sales', "germinationLevel", { type: Sequelize.INTEGER, }, { transaction });
      await queryInterface.addColumn('sales', "saleDate", {  type: Sequelize.DATE, allowNull: false  }, { transaction });
      await queryInterface.addColumn('saleProducts', "description", { type: Sequelize.STRING(100), }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('sales', "valueInput"),      
      queryInterface.removeColumn('sales', "contact"),
      queryInterface.removeColumn('sales', "capture"),
      queryInterface.removeColumn('sales', "nature"),
      queryInterface.removeColumn('sales', "distance"),
      queryInterface.removeColumn('sales', "satisfaction"),
      queryInterface.removeColumn('sales', "germinationLevel"),
      queryInterface.removeColumn('sales', "saleDate"),
      queryInterface.removeColumn('saleProducts', "description"),
    ]);
  },
};