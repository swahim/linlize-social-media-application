const {Client} = require("pg");

const client = new Client({

    connectionString: "postgressql://postgres:Helloworld@database-1.chajduvhgewp.us-east-2.rds.amazonaws.com:5432/postgres"
});
module.exports = client;