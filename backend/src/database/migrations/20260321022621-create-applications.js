'use strict';

const TABLE_NAME = 'applications';
const TABLE_NAME_2 = 'sales';

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(TABLE_NAME, {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        companyId: {
          type: Sequelize.UUID,
          references: { model: 'companies', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: true,
        },
        clientId: {
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: true,
        },
        saleId: {
          type: Sequelize.INTEGER,
          references: { model: 'sales', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: true,
        },
        date: { type: Sequelize.DATE, allowNull: false },
        approved: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        type: { type: Sequelize.STRING(15), allowNull: false, defaultValue: 'APLICAÇÃO' },
        productId: {
          type: Sequelize.INTEGER,
          references: { model: 'products', key: 'id' },
          onUpdate: 'CASCADE',
          allowNull: true,
        },
        amount: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
        note: { type: Sequelize.STRING(1000), allowNull: true, },
        image1: { type: Sequelize.STRING(500) },
        image2: { type: Sequelize.STRING(500) },
        image3: { type: Sequelize.STRING(500) },
        image4: { type: Sequelize.STRING(500) },
        createdAt: { type: Sequelize.DATE, allowNull: false, },
        updatedAt: { type: Sequelize.DATE, allowNull: false, },
      });
      await queryInterface.addIndex(TABLE_NAME, ['createdAt'], { transaction });
      await queryInterface.addColumn(TABLE_NAME_2, "satisfactionSurveyDate", { type: Sequelize.DATE, allowNull: true }, { transaction });
      await queryInterface.addColumn(TABLE_NAME_2, "imageSatisfaction1", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME_2, "imageSatisfaction2", { type: Sequelize.STRING(500) }, { transaction });
      await queryInterface.addColumn(TABLE_NAME_2, "userSatisfactionId", {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
      }, { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      await queryInterface.dropTable(TABLE_NAME),
      await queryInterface.removeColumn(TABLE_NAME_2, "imageSatisfaction1"),
      await queryInterface.removeColumn(TABLE_NAME_2, "imageSatisfaction2"),
      await queryInterface.removeColumn(TABLE_NAME_2, "userSatisfactionId"),
      await queryInterface.removeColumn(TABLE_NAME_2, "satisfactionSurveyDate"),
    ]);
  }
};
