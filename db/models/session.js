'use strict';

module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("Session",
    {
      tokenId: {allowNull: false, type: DataTypes.STRING},
      userId: {allowNull: false, type: DataTypes.INTEGER}
    },
  );

  Session.associate = function(models) {
    Session.belongsTo(models.User, {foreignKey: 'userId', onDelete: 'CASCADE'});
  };

  return Session;
};
