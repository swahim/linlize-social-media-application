const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
exports.signUp = (req, res) => {
  console.log("entered in signup mode");
  const { name, email, password } = req.body;
  client
    .query(`SELECT * FROM details WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

      if (isValid.length !== 0) {
        res.status(400).json({
          error: "user already exists",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              error: "internal server error occured",
            });
          }

          const user = {
            name,
            email,
            password: hash,
          };

          client
            .query(
              `INSERT INTO details (name, email, password) VALUES ('${user.name}', '${user.email}' , '${user.password}');`
            )
            .then((data) => {
              const token = jwt.sign(
                {
                  email: email,
                },
                process.env.SECRET_KEY
              );

              res.status(200).json({
                message: "user added successfully",
                token: token,
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: "Database error occured!",
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Database error occured!",
      });
    });
};

exports.signIn = (req, res) => {
  const { email, password } = req.body;

  client
    .query(`SELECT * FROM details WHERE email='${email}';`)
    .then((data) => {
      userData = data.rows;
      if (userData.length === 0) {
        res.status(400).json({
          error: "user does not exist, signup instead!",
        });
      } else {
        bcrypt.compare(password, userData[0].password, (err, result) => {
          if (err) {
            res.status(500).json({
              error: "server error",
            });
          } else if (result === true) {
            const token = jwt.sign(
              {
                email: email,
              },
              process.env.SECRET_KEY
            );
            res.status(200).json({
              message: "user signed in successfully",
              token: token,
            });
          } else {
            res.status(400).json({
              error: "Enter correct password!",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "database error occured!",
      });
    });
};
