'use strict';

const { userType } = require("../../utils/defaultValues");

const TABLE_NAME = 'users';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: { type: Sequelize.STRING(255), },
      email: { type: Sequelize.STRING(255), },
      companyId: {
        type: Sequelize.UUID,
        references: { model: 'companies', key: 'id' },
        onUpdate: 'CASCADE',
        allowNull: false,
      },
      userAWSId: { type: Sequelize.STRING(50) },
      image: { type: Sequelize.STRING(500), allowNull: true, },
      phone: { type: Sequelize.STRING(30), allowNull: true, },
      cpfCnpj: { type: Sequelize.STRING(30), allowNull: true, },
      state: { type: Sequelize.STRING(100), },
      city: { type: Sequelize.STRING(100), },
      address: { type: Sequelize.STRING(300), },
      salesRepresentative: { type: Sequelize.STRING(300), },
      capture: { type: Sequelize.STRING(300), },
      type: {
        type: Sequelize.STRING(30), allowNull: false,
        defaultValue: userType.USER
      },
      commissionMonth: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0, },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true, },
      dateOfBirth: {
        type: Sequelize.DATE
      },
      dateOfBirthMonth: {
        type: Sequelize.INTEGER
      },
      hiringDate: {
        type: Sequelize.DATE
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
