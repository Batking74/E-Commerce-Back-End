// Importing Packages
const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class Category extends Model {}
  Category.init({
    // defining columns
    category_name: DataTypes.STRING(255)
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
  });


// Exporting Category Table
module.exports = Category;
