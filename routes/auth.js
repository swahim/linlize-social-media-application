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
  const firstname = req.user.name.familyName;
  const lastname = req.user.name.givenName;
  const profilepic = req.user.photos[0].value;
  const email = req.user.emails[0].value;
  console.log(email);

  client
    .query(`SELECT * FROM details WHERE email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

      if (isValid.length !== 0) {
        // user already exists
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.SECRET_KEY
        );
        res.cookie("linkzie", token, {
          expires: new Date(Date.now() + 900000),
        });
        // res.sendFile(__dirname + "./public/feed");
        const path = require("path");
        console.log(path.resolve("public/pages/feed/index.html"));

        res.sendFile(path.resolve("public/pages/feed/index.html"));
        // res.redirect("http://localhost:8000/pages/feed");
      } else {
        // user logged in with google for first time

        // converting profilepic to base64 and then storing it in imgdata
        let imgdata;
        const mime = "image/jpeg";
        imageToBase64(profilepic).then((response) => {
          imgdata = response;
        });
        client.query(
          `INSERT INTO details (firstname, lastname, email, img, mime) VALUES  ('${firstname}','${lastname}','${email}',bytea('${imgdata}'), '${mime}');`
        );
        const token = jwt.sign(
          {
            email: email,
          },
          process.env.SECRET_KEY
        );
        res.cookie("linkzie", token, {
          expires: new Date(Date.now() + 900000),
        });
        const path = require("path");
        console.log(path.resolve("public/pages/feed"));
        res.sendFile(path.resolve("public/pages/feed"));
        // res.redirect(`http://127.0.0.1:5500/pages/feed?token=${token}`);

        // res.redirect("http://127.0.0.1:5500/pages/feed?token=");
        // res.setHeader('linkzie', token);
        // res.redirect("/pages/feed");
      }
    });
});
router.get("/cookie-testing", (req, res) => {
  console.log(req.cookies);
});
router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["email"] })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "http://127.0.0.1:5500/pages/feed",
    failureRedirect: "http://127.0.0.1:5500/pages/signin",
  }),
  (req, res) => {
    res.cookie("test2", "test2");
    res.redirect("http://127.0.0.1:5500/pages/feed");
  }
);
module.exports = router;
