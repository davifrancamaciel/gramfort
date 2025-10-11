'use strict';

const TABLE_NAME = 'companies';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING(255), },
      image: { type: Sequelize.STRING(300), },
      banner: { type: Sequelize.STRING(300), },
      email: { type: Sequelize.STRING(150), },
      phone: { type: Sequelize.STRING(30), },
      groups: { type: Sequelize.STRING(1000), },
      pixKey: { type: Sequelize.STRING(100), },
      manager: { type: Sequelize.STRING(100), },
      state: { type: Sequelize.STRING(100), },
      city: { type: Sequelize.STRING(100), },
      address: { type: Sequelize.STRING(300), },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      individualCommission: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(TABLE_NAME);
  }
};
