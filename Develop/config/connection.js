// Importing Packages
const Sequelize = require('sequelize');
const path = require('path');
const envPath = path.join(__dirname, '../.env');
require('dotenv').config({ path: envPath });

const sequelize = connectServer();


// Connects to database server
function connectServer() {
    if(process.env.JAWSDB_URL) {
        return new Sequelize(process.env.JAWSDB_URL);
    }
    else {
        return new Sequelize(
            process.env.DB_NAME,
            process.env.DB_USER,
            process.env.DB_PASSWORD, {
                host: process.env.DB_HOST,
                dialect: 'mysql',
                dialectOptions: {
                    decimalNumbers: true,
                },
            });
        }
}


// Testing Sequelize Connection
sequelize.authenticate()
.then(() => {
    console.info('Successfully authenticated!');
})
.catch(error => {
    console.error(`Something went wrong in database connection: ${error.message}`);
    throw error;
})


// Exporting Modules
module.exports = sequelize;
