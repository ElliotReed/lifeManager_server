'use strict';

export default {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('flow', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      aspectId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'aspect',
          key: 'id'
        },
        onDelete: 'NO ACTION'
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'user',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      flow: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      durationInMinutes: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      pointValue: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      dtCompleted: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('flow');
  }
};
