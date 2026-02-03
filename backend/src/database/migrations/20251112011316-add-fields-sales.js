'use strict';

const TABLE_NAME = 'sales';

module.exports = {

  async up(queryInterface, Sequelize) {

    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(TABLE_NAME, "visitId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'visits', key: 'id' },
        onUpdate: 'CASCADE',
      });
      await queryInterface.addColumn(TABLE_NAME, "hash", { type: Sequelize.UUID }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "approved", { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "internalNote", { type: Sequelize.STRING(500), }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "access", { type: Sequelize.INTEGER, }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "complexityLevel", { type: Sequelize.INTEGER, }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "daysExecution", { type: Sequelize.INTEGER, }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "expectedDateForApplication", { type: Sequelize.DATE, }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "discountDescription", { type: Sequelize.STRING(50) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "discountValue", { type: Sequelize.DECIMAL(15, 2), defaultValue: 0 }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "phSoil", { type: Sequelize.STRING(100) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "sunOrientation", { type: Sequelize.STRING(100) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "paymentMethod", { type: Sequelize.STRING(200) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "image1", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "image2", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "image3", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "image4", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "image5", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME, "image6", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn('visits', "note", { type: Sequelize.STRING(500), }, { transaction });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.removeColumn(TABLE_NAME, "visitId"),
      await queryInterface.removeColumn(TABLE_NAME, "hash"),
      await queryInterface.removeColumn(TABLE_NAME, "approved"),
      await queryInterface.removeColumn(TABLE_NAME, "internalNote"),
      await queryInterface.removeColumn(TABLE_NAME, "access"),
      await queryInterface.removeColumn(TABLE_NAME, "complexityLevel"),
      await queryInterface.removeColumn(TABLE_NAME, "daysExecution"),
      await queryInterface.removeColumn(TABLE_NAME, "expectedDateForApplication"),
      await queryInterface.removeColumn(TABLE_NAME, "discountDescription"),
      await queryInterface.removeColumn(TABLE_NAME, "discountValue"),
      await queryInterface.removeColumn(TABLE_NAME, "phSoil"),
      await queryInterface.removeColumn(TABLE_NAME, "sunOrientation"),
      await queryInterface.removeColumn(TABLE_NAME, "paymentMethod"),
      await queryInterface.removeColumn(TABLE_NAME, "image1"),
      await queryInterface.removeColumn(TABLE_NAME, "image2"),
      await queryInterface.removeColumn(TABLE_NAME, "image3"),
      await queryInterface.removeColumn(TABLE_NAME, "image4"),
      await queryInterface.removeColumn(TABLE_NAME, "image5"),
      await queryInterface.removeColumn(TABLE_NAME, "image6"),
      await queryInterface.removeColumn('visits', "note"),
    ]);
  },
};