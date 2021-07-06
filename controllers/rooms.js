require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());

exports.joinroom = (req, res) => {
  console.log("in create room");
  const room = req.params.room; // which user wants to text

  client.query(`SELECT firstname, lastname FROM details WHERE email='${req.email}'`)
  .then((data) => {
    data =data.rows[0];
    console.log(data);
    res.status(200).json({
      name: data.firstname+ " " + data.lastname,
    });
  })
  .catch((err) => {
    console.log(err);
    res.status(500).json({
      message: "server error occured",
    })
  })
  
};
