require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// route to join user in a roomName
// using this router to send basic details to client using email from middleware/verifyToken.js
exports.joinroom = (req, res) => {
  // getting basic details by providing email from middleware/verifyToken.js
  client
    .query(`SELECT firstname, lastname FROM details WHERE email='${req.email}'`)
    .then((data) => {
      data = data.rows[0];
      // sending 200 response
      res.status(200).json({
        name: data.firstname + " " + data.lastname,
      });
    })
    // during this process, if any error occurs
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "server error occured",
      });
    });
};
