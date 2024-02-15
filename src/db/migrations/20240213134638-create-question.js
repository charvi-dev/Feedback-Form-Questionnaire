'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tx = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('question', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        formId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'form', key: 'id' },
        },
        questionDescription: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      }, {
        modelName: 'Question',
        tableName: 'question',
        freezeTableName: true,
        transaction: tx,
      });

      await tx.commit();
    } catch (err) {
      await tx.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const tx = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('question');
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  },
};
