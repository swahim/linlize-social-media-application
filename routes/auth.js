require("dotenv").config();
const express = require("express");
const { signUp, signIn, googleauth } = require("../controllers/auth");
const router = express.Router();
const jwt = require("jsonwebtoken");
const cors = require("cors");
const app = express();
const passport = require("passport");
const imageToBase64 = require("image-to-base64");
const client = require("../configs/db");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static("public"));
router.post("/signUp", signUp);
router.post("/signIn", signIn);

// auth with google
router.get(
  "/google",
  passport.authenticate("google", {
    // scope: ["profile"],
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("in redirect url");
  let token;
  console.log(req.user);

  // Getting the information given by google when user authenticated with google like first name, last name, profile pic, email.
  const firstname = req.user.name.familyName;
  const lastname = req.user.name.givenName;
  const profilepic = req.user.photos[0].value;
  const email = req.user.emails[0].value;

  // First we will check if the user already exists or not in our database
  client
    .query(`SELECT * FROM details WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

      // Checking if user already exists, then we can send token to client with the help of cookies,
      // not sending as a json object because we weren't able to acquire token using json object
      if (isValid.length !== 0) {
        console.log("in user already exists");
        // Creating a token with the help of jwt by providing email and a secret key
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.SECRET_KEY
        );

        // Sending cookie to client with a life span of 15 mins
        res.cookie("linkize", token, {
          expires: new Date(Date.now() + 900000),
        });

        // After sending the cookies, it's time to redirect feed page
        res.redirect("/pages/feed");
      } else {
        // This is else block when user logged in with google for first time, so hence we are storing users name, email and profile pic

        let imgdata;

        // By default we are defining mime type to image/jpeg as we are getting in that format
        const mime = "image/jpeg";

        // We had to write queries inside this function as imageToBase64 was asynchronous function
        // imageToBase64 is a package which helps to convert image or image url to base64
        // since we are having image url given by google, passing it to get required data and store in data  our base
        imageToBase64(profilepic)
          .then((response) => {
            imgdata = response;
            client.query(
              `INSERT INTO details (firstname, lastname, email, img, mime) VALUES  ('${firstname}','${lastname}','${email}',bytea('${imgdata}'), '${mime}');`
            );

            // After successfully storing required data in our database, it's time to send cookies and redirect to client side
            const token = jwt.sign(
              {
                email: email,
              },
              process.env.SECRET_KEY
            );
            res.cookie("linkize", token, {
              expires: new Date(Date.now() + 900000),
            });
            res.redirect("/pages/feed");
          })
          // During this process, if any error occured
          .catch((err) => {
            console.log(err);
          });
      }
    });
});
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/pages/signin' }),
  function(req, res) {
    console.log("in facebook call back");
    // Getting the information given by facebook when user authenticated with facebook like first name, last name, profile pic, email.
  const firstname = req.user.name.familyName;
  const lastname = req.user.name.givenName;
  const profilepic = req.user.photos[0].value;
  const email = req.user.emails[0].value;

  // First we will check if the user already exists or not in our database
  client
    .query(`SELECT * FROM details WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

      // Checking if user already exists, then we can send token to client with the help of cookies,
      // not sending as a json object because we weren't able to acquire token using json object
      if (isValid.length !== 0) {
        console.log("in user already exists");
        // Creating a token with the help of jwt by providing email and a secret key
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.SECRET_KEY
        );

        // Sending cookie to client with a life span of 15 mins
        res.cookie("linkize", token, {
          expires: new Date(Date.now() + 900000),
        });

        // After sending the cookies, it's time to redirect feed page
        res.redirect("/pages/feed");
      } else {
        // This is else block when user logged in with facebook for first time, so hence we are storing users name, email and profile pic

        let imgdata;

        // By default we are defining mime type to image/jpeg as we are getting in that format
        const mime = "image/jpeg";

        // We had to write queries inside this function as imageToBase64 was asynchronous function
        // imageToBase64 is a package which helps to convert image or image url to base64
        // since we are having image url given by facebook, passing it to get required data and store in data  our base
        imageToBase64(profilepic)
          .then((response) => {
            imgdata = response;
            client.query(
              `INSERT INTO details (firstname, lastname, email, img, mime) VALUES  ('${firstname}','${lastname}','${email}',bytea('${imgdata}'), '${mime}');`
            );

            // After successfully storing required data in our database, it's time to send cookies and redirect to client side
            const token = jwt.sign(
              {
                email: email,
              },
              process.env.SECRET_KEY
            );
            res.cookie("linkize", token, {
              expires: new Date(Date.now() + 900000),
            });
            res.redirect("/pages/feed");
          })
          // During this process, if any error occured
          .catch((err) => {
            console.log(err);
          });
      }
    });
  });
module.exports = router;
