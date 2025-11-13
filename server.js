const express = require('express');
const app = express();
const  swaggerUi  = require( "swagger-ui-express");
const YAML = require("yamljs");
require('dotenv').config();
require('./initialize_db')();


const port = process.env.PORT ||  3000;

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(require('./routes/user'));
app.use("/admin", require('./routes/admin'));

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
