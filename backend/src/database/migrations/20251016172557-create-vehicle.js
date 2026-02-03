'use strict';

const TABLE_NAME = 'vehicles';

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
        category: { type: Sequelize.STRING(100), },
        model: { type: Sequelize.STRING(100), },
        year: { type: Sequelize.INTEGER, },
        kmInitial: { type: Sequelize.INTEGER, },
        kmCurrent: { type: Sequelize.INTEGER, },
        value: { type: Sequelize.DECIMAL(15, 2), defaultValue: 0, },
        description: { type: Sequelize.STRING(1000), allowNull: true, },        
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
