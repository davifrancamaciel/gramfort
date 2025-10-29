'use strict';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {

      queryInterface.addColumn('sales', "valueInput", { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 });
      queryInterface.addColumn('sales', "inputs", { type: Sequelize.TEXT });
      queryInterface.addColumn('sales', "contact", { type: Sequelize.STRING(100), });
      queryInterface.addColumn('sales', "capture", { type: Sequelize.STRING(30), });
      queryInterface.addColumn('sales', "nature", { type: Sequelize.STRING(30), });
      queryInterface.addColumn('sales', "distance", { type: Sequelize.INTEGER, });
      queryInterface.addColumn('sales', "satisfaction", { type: Sequelize.INTEGER, });
      queryInterface.addColumn('sales', "germinationLevel", { type: Sequelize.INTEGER, });
      queryInterface.addColumn('sales', "saleDate", {  type: Sequelize.DATE, allowNull: false, defaultValue: new Date()  });
      queryInterface.addColumn('products', "isInput", { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
      queryInterface.addColumn('saleProducts', "description", { type: Sequelize.STRING(100), });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('sales', "valueInput"),
      queryInterface.removeColumn('sales', "inputs"),
      queryInterface.removeColumn('sales', "contact"),
      queryInterface.removeColumn('sales', "capture"),
      queryInterface.removeColumn('sales', "nature"),
      queryInterface.removeColumn('sales', "distance"),
      queryInterface.removeColumn('sales', "satisfaction"),
      queryInterface.removeColumn('sales', "germinationLevel"),
      queryInterface.removeColumn('sales', "saleDate"),
      queryInterface.removeColumn('products', "isInput"),
      queryInterface.removeColumn('saleProducts', "description"),
    ]);
  },
};