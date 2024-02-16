'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('submission', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      formId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'form', key: 'id' },
      },
      submissionDate:{
        type:Sequelize.DATE,
        allowNull:false,
      },
      formResponse:{
        type:Sequelize.JSON,
        allowNull:false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('submission');
  },
};
