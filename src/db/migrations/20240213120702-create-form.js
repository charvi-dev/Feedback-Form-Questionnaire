'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tx = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.createTable('form', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'user', key: 'id' },
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        publishedDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        closedDate: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        link: {
          type: Sequelize.UUID,
          allowNull: true,
          unique:true
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
        modelName: 'Form',
        tableName: 'form',
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
      await queryInterface.dropTable('form');
      await tx.commit();
    } catch (error) {
      await tx.rollback();
      throw error;
    }
  },
};
