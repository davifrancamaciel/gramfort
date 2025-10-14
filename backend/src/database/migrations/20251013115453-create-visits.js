'use strict';

const TABLE_NAME = 'visits';

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
        value: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
        state: { type: Sequelize.STRING(100), },
        city: { type: Sequelize.STRING(100), },
        address: { type: Sequelize.STRING(300), },      
        km: { type: Sequelize.INTEGER, allowNull: true, },
        description: { type: Sequelize.STRING(1000), allowNull: true, },
        date: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
        paymentDate: { type: Sequelize.DATE, allowNull: false, defaultValue: new Date() },
        paidOut: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
        carriedOut: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
        proposal: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
        sale: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false, },
        image: { type: Sequelize.STRING(500), allowNull: true, },

        createdAt: { type: Sequelize.DATE, allowNull: false, },
        updatedAt: { type: Sequelize.DATE, allowNull: false, },
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
