console.log("in indexx");
const knex = require("knex")({
    client: "pg",
    connection: "postgressql://postgres:Helloworld@database-1.chajduvhgewp.us-east-2.rds.amazonaws.com:5432/postgres",
  });

  knex.insert({firstname: "asdf", lastname: "lkj", email: "asdfasdf@gmail.com", phonenumber: "12345", dob: "2001/12/01", password: "test"}).into("details")