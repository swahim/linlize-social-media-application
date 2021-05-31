const {Client} = require("pg");

const client = new Client({

    connectionString: "postgressql://sohan_webkriti:webkrititest@webkriti.chajduvhgewp.us-east-2.rds.amazonaws.com:5432/webkriti"
});
module.exports = client;