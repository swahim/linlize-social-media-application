require("dotenv").config();

const pg = require("pg");


const client = new pg.Client(process.env.DB_CONNECTION_STRING);

module.exports = client