'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Sessions", {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      userId: {allowNull: false, type: Sequelize.INTEGER},
      tokenId: {type: Sequelize.STRING(36)},
      ...["createdAt", "updatedAt"].reduce((pojo, key) => {
        return {...pojo, [key]: {allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW")}};
      }, {})
    });
  },
  down: queryInterface => queryInterface.dropTable('Sessions')
};
