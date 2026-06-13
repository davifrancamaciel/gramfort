'use strict';



module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      
      await queryInterface.addIndex('sales', ['saleDate'], { transaction });
      await queryInterface.addIndex('sales', ['approved'], { transaction });
      await queryInterface.addIndex('sales', ['hash'], { transaction });
      await queryInterface.addIndex('sales', ['satisfactionSurveyDate'], { transaction });

      await queryInterface.addIndex('expenses', ['paymentDate'], { transaction });
      await queryInterface.addIndex('expenses', ['paidOut'], { transaction });
      await queryInterface.addIndex('expenses', ['title'], { transaction });

      await queryInterface.addIndex('visits', ['paymentDate'], { transaction });
      await queryInterface.addIndex('visits', ['paidOut'], { transaction });

      await queryInterface.addIndex('users', ['name'], { transaction });
      await queryInterface.addIndex('users', ['email'], { transaction });

      await queryInterface.addIndex('products', ['name'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      
      await queryInterface.removeIndex('sales', ['saleDate'], { transaction });
      await queryInterface.removeIndex('sales', ['approved'], { transaction });
      await queryInterface.removeIndex('sales', ['hash'], { transaction });
      await queryInterface.removeIndex('sales', ['satisfactionSurveyDate'], { transaction });

      await queryInterface.removeIndex('expenses', ['paymentDate'], { transaction });
      await queryInterface.removeIndex('expenses', ['paidOut'], { transaction });
      await queryInterface.removeIndex('expenses', ['title'], { transaction });

      await queryInterface.removeIndex('visits', ['paymentDate'], { transaction });
      await queryInterface.removeIndex('visits', ['paidOut'], { transaction });

      await queryInterface.removeIndex('users', ['name'], { transaction });
      await queryInterface.removeIndex('users', ['email'], { transaction });

      await queryInterface.removeIndex('products', ['name'], { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
