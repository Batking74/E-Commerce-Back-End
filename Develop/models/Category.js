// const sequelize = require('sequelize');
// const db = require('../config/connection');

// Creating a User Table
// const User = db.define('user', {
  // Defining Columns
  // username: {
    // Defining Column Attributes
//     type: sequelize.DataTypes.STRING,
//     allowNull: false
//   },
//   password: {
//     type: sequelize.DataTypes.STRING,
//     allowNull: false
//   },
//   age: {
//     type: sequelize.DataTypes.INTEGER,
//     allowNull: false
//   },
//   Product: {
//     type: sequelize.DataTypes.STRING(2999),
//     allowNull: false
//   }
// });





// Creates the Table if it doesn't exist, does nothing if table already exists
// User.sync({ alter: true })
// .then(res => {
//   console.log("Synced Successfully!!!")
//   console.log(res)
// })
// .catch(error => {
//   console.error(`OOPS, Something went wrong!: ${error.message}`);
//   throw error;
// })







const { Model, DataTypes } = require('sequelize');

const sequelize = require('../config/connection');

class Category extends Model {}
  Category.init({
    // define columns
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
