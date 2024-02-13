'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    const tx = await queryInterface.sequelize.transaction()


    try {
      await queryInterface.createTable('user',
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
          },
          userName: {
            type: Sequelize.STRING,
            allowNull: false
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          }
        },

        {
          modelName: 'User',
          tableName: 'user',
          freezeTableName: true,
          transaction: tx
        }
      );

      await tx.commit()

    } catch (err) {
      await tx.rollback()
      throw err; ``
    }


  },


  async down(queryInterface, Sequelize) {
    const tx = await queryInterface.sequelize.transaction()
    try {
      await queryInterface.dropTable('user');
      await tx.commit()
    }
    catch (error) {
      await tx.rollback()
      throw error

    }


  }
}
