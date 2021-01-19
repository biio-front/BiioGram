'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'desc', Sequelize.TEXT);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'desc');
  }
};
