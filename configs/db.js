require("dotenv").config();

const pg = require("pg");

// We have used postgresql in our project & service: Amazon Relational Database Service
// process.env.DB_CONNECTION_STRING is connection string of database
// DB_CONNECTION_STRING = postgressql://<username>:<password>@<endpoint>:<port>/postgres

const client = new pg.Client(process.env.DB_CONNECTION_STRING);

module.exports = client