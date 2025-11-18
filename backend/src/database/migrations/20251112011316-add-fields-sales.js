'use strict';

const TABLE_NAME = 'sales';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {
      queryInterface.addColumn(TABLE_NAME, "visitId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'visits', key: 'id' },
        onUpdate: 'CASCADE',
      });
      queryInterface.addColumn(TABLE_NAME, "hash", { type: Sequelize.UUID });
      queryInterface.addColumn(TABLE_NAME, "approved", { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
      queryInterface.addColumn(TABLE_NAME, "internalNote", { type: Sequelize.STRING(500), });
      queryInterface.addColumn(TABLE_NAME, "access", { type: Sequelize.INTEGER, });
      queryInterface.addColumn(TABLE_NAME, "complexityLevel", { type: Sequelize.INTEGER, });
      queryInterface.addColumn(TABLE_NAME, "daysExecution", { type: Sequelize.INTEGER, });
      queryInterface.addColumn(TABLE_NAME, "expectedDateForApplication", { type: Sequelize.DATE, });
      queryInterface.addColumn(TABLE_NAME, "discountDescription", { type: Sequelize.STRING(50) });
      queryInterface.addColumn(TABLE_NAME, "discountValue", { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 });
      queryInterface.addColumn(TABLE_NAME, "phSoil", { type: Sequelize.STRING(100) });
      queryInterface.addColumn(TABLE_NAME, "sunOrientation", { type: Sequelize.STRING(100) });
      queryInterface.addColumn(TABLE_NAME, "image1", { type: Sequelize.STRING(500) });
      queryInterface.addColumn(TABLE_NAME, "image2", { type: Sequelize.STRING(500) });
      queryInterface.addColumn(TABLE_NAME, "image3", { type: Sequelize.STRING(500) });
      queryInterface.addColumn(TABLE_NAME, "image4", { type: Sequelize.STRING(500) });
      queryInterface.addColumn(TABLE_NAME, "image5", { type: Sequelize.STRING(500) });
      queryInterface.addColumn(TABLE_NAME, "image6", { type: Sequelize.STRING(500) });
      queryInterface.addColumn('visits', "note", { type: Sequelize.STRING(500), });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "visitId"),
      queryInterface.removeColumn(TABLE_NAME, "hash"),
      queryInterface.removeColumn(TABLE_NAME, "approved"),
      queryInterface.removeColumn(TABLE_NAME, "internalNote"),
      queryInterface.removeColumn(TABLE_NAME, "access"),
      queryInterface.removeColumn(TABLE_NAME, "complexityLevel"),
      queryInterface.removeColumn(TABLE_NAME, "daysExecution"),
      queryInterface.removeColumn(TABLE_NAME, "expectedDateForApplication"),
      queryInterface.removeColumn(TABLE_NAME, "discountDescription"),
      queryInterface.removeColumn(TABLE_NAME, "discountValue"),
      queryInterface.removeColumn(TABLE_NAME, "phSoil"),
      queryInterface.removeColumn(TABLE_NAME, "image1"),
      queryInterface.removeColumn(TABLE_NAME, "image2"),
      queryInterface.removeColumn(TABLE_NAME, "image3"),
      queryInterface.removeColumn(TABLE_NAME, "image4"),
      queryInterface.removeColumn(TABLE_NAME, "image5"),
      queryInterface.removeColumn(TABLE_NAME, "image6"),
      queryInterface.removeColumn('visits', "note"),
    ]);
  },
};