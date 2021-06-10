require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const imageToBase64 = require("image-to-base64");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "459450636110-kjiimp7ejasn59glq1rtm8484pc5rgrn.apps.googleusercontent.com";
const client_google = new OAuth2Client(CLIENT_ID);

app.use(express.json());
app.use(cors());

var cookieParser = require("cookie-parser");
app.use(cookieParser());

exports.signUp = (req, res) => {
  console.log("entered in signup mode");
  const { username, email, password } = req.body;
  client
    .query(`SELECT * FROM details WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

      if (isValid.length !== 0) {
        res.status(400).json({
          message: "user already exists",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(500).json({
              message: "internal server error occured",
            });
          }

          const user = {
            username,
            email,
            password: hash,
          };

          client
            .query(
              `INSERT INTO details (username, email, password) VALUES  ('${user.username}','${user.email}','${user.password}');`
            )
            .then((data) => {
              console.log(data);
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
              console.log(err);
              res.status(500).json({
                message: "Database error occured!",
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Database error occured!!",
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
          message: "user does not exist, signup instead!",
        });
      } else {
        bcrypt.compare(password, userData[0].password, (err, result) => {
          if (err) {
            res.status(500).json({
              message: "server error",
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
              emailid: email,
            });
          } else {
            res.status(400).json({
              message: "Enter correct password!",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "database error occured!",
      });
    });
};
exports.googleauth = (req, res) => {
  let imgdata;
  const mime = "image/jpeg";
  let token = req.body.token;
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const profilepic = req.body.profilepic;
  console.log(email, firstname, lastname, profilepic);
  // console.log(token);

  async function verify() {
    const ticket = await client_google.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];
    console.log(payload);
  }
  verify()
    .then(() => {
      // res.cookie("session-token", token);
      res.status(200).json({
        googletoken: token,
        emailid: email,
      });
    })
    .catch(console.error);
  imageToBase64(profilepic) // Image URL
    .then((response) => {
      imgdata = response;
      // console.log(imgdata);
      // console.log(response); // "iVBORw0KGgoAAAANSwCAIA..."
      client
        .query(`SELECT * FROM details WHERE email = '${email}';`)
        .then((data) => {
          isValid = data.rows;

          if (isValid.length !== 0) {
            console.log("user already exists");
          } else {
            client.query(
              `INSERT INTO details (firstname, lastname, email, img, mime) VALUES  ('${firstname}','${lastname}','${email}',bytea('${imgdata}'), '${mime}');`
            );
          }
        });
    })
    .catch((error) => {
      console.log(error); // Logs an error if there was one
    });
};
