'use strict';

const TABLE_NAME = 'sales';

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
          allowNull: false,
        },
        products: { type: Sequelize.TEXT, },
        value: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
        commission: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
        note: { type: Sequelize.STRING(500), allowNull: true, },
        invoiceNumber: { type: Sequelize.STRING(50) },
        germinationLevel: { type: Sequelize.STRING(100) },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      });
      await queryInterface.addIndex(TABLE_NAME, ['createdAt'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
