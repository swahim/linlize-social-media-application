require("dotenv").config();

const pg = require("pg");


// const client = new pg.Client("postgressql://postgres:Helloworld@database-1.chajduvhgewp.us-east-2.rds.amazonaws.com:5432/postgres");
const client = new pg.Client(process.env.DB_CONNECTION_STRING);

module.exports = client