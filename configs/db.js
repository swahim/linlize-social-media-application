const pg = require("pg");
const client = new pg.Client("postgressql://postgres:Helloworld@database-1.chajduvhgewp.us-east-2.rds.amazonaws.com:5432/postgres");

module.exports = client