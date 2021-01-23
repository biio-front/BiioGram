const DataTypes = require('sequelize');
const { Model } = DataTypes;

module.exports = class Token extends Model {
  static init (sequelize) {
    return super.init({
      // id
      refreshToken: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      modelName: 'Token',
      tableName: 'tokens',
      charset: 'utf8',
      collate: 'utf8_general_ci',
      sequelize,
    });
  }
}