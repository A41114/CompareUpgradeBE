'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chatbox extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Chatbox.belongsTo(models.User, { as: 'customer', foreignKey: 'customer_id' });
      Chatbox.belongsTo(models.User, { as: 'admin', foreignKey: 'admin_id' });
      Chatbox.hasMany(models.Message, { foreignKey: 'chat_room_id' });
    }
  }
  Chatbox.init({
    customer_id: DataTypes.INTEGER,
    admin_id: DataTypes.INTEGER,
    status:DataTypes.STRING

  }, {
    sequelize,
    modelName: 'Chatbox',
    tableName: 'chatbox',
  });
  return Chatbox;
};