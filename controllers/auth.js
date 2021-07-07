require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// Sign up route
exports.signUp = (req, res) => {
  // Getting email and password from client
  const { email, password } = req.body;

  // Checking if user already exists in our database
  client
    .query(`SELECT * FROM details WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;
      // If user already exists, then sending a response => user already exists
      if (isValid.length !== 0) {
        res.status(400).json({
          message: "user already exists",
        });
      } else {
        // else hashing users password and storing in database
        bcrypt.hash(password, 10, (err, hash) => {
          // during hashing if any error occurs, send a response => server error occured
          if (err) {
            res.status(500).json({
              error: "internal server error occured",
            });
          }
          // if password gets hashed then we can store users email and hashed password in our database
          const user = {
            email,
            password: hash,
          };

          // Query to store users email and hashed password
          client
            .query(
              `INSERT INTO details (email, password) VALUES  ('${user.email}','${user.password}');`
            )
            .then((data) => {
              // getting users id of the current user
              // user id is primary key not null in database
              client
                .query(`SELECT userid FROM details WHERE email='${user.email}'`)
                .then((data) => {
                  // creating a token of email, user_id and a secret key
                  const token = jwt.sign(
                    {
                      email: email,
                      user_id: data.rows[0].userid,
                    },
                    process.env.SECRET_KEY
                  );

                  // sending token to client with a success message
                  res.status(200).json({
                    message: "user added successfully",
                    token: token,
                  });
                })

                // while getting users id, if any error occurs, sending a 500 error
                .catch((err) => {
                  console.log(err);
                  res.status(500).json({
                    error: "Database error occured!",
                  });
                });
            })

            // while storing user email and password, if any error occurs, sending a 500 error
            .catch((err) => {
              console.log(err);
              res.status(500).json({
                error: "Database error occured!",
              });
            });
        });
      }
    })

    // if database occured, then sending 500 error
    .catch((err) => {
      res.status(500).json({
        error: "Database error occured!!",
      });
    });
};

// Sign in route
exports.signIn = (req, res) => {

  // getting email & password from client
  const { email, password } = req.body;

  // checking whether user exists or not
  client
    .query(`SELECT * FROM details WHERE email='${email}';`)
    .then((data) => {
      userData = data.rows;

      // if user does not exist, then sending a response => user doesn't exists, sign up instead
      if (userData.length === 0) {
        res.status(401).json({
          error: "user does not exist, signup instead!",
        });
      } else { // if user exists then comparing password given by client and hashed password that is stored in our database
        bcrypt.compare(password, userData[0].password, (err, result) => {
          // during bcrypt comparison if error occurs then sending server error response
          if (err) {
            res.status(500).json({
              message: "server error",
            });
          } else if (result === true) { // if password from client and hashed password matches result
            // then sending token to client of email and user id with  a secret key
            const token = jwt.sign(
              {
                email: email,
                user_id: data.rows[0].userid,
              },
              process.env.SECRET_KEY
            );

            //sending a 200 response when users logs with correct credentials
            res.status(200).json({
              message: "user signed in successfully",
              token: token,
            });
          } else { // if the user enters incorrect password, then sending 401 res 
            res.status(401).json({
              error: "Wrong password!",
            });
          }
        });
      }
    })
    // if any error occurs while getting users from database
    .catch((err) => {
      res.status(500).json({
        message: "database error occured!",
      });
    });
};
