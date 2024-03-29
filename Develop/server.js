const express = require('express');
const routes = require('./routes');
// import sequelize connection
const coonection = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

coonection.sync().then(res => {
  console.warn(res)
  console.log(res)
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
  });
})