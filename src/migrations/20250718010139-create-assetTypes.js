'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assetType', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('assetType');
  }
};
