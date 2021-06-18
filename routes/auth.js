const express = require("express");
const { signUp, signIn, googleauth } = require("../controllers/auth");
const router = express.Router();
const cors = require("cors");
const app = express();
const passport = require("passport");
app.use(express.json());
app.use(cors());
router.post("/signUp", signUp);
router.post("/signIn", signIn);

// auth with google
router.get("/google", passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  console.log("in redirect url");
  res.cookie("test", "test");
  res.redirect("http://127.0.0.1:5502/public/pages/feed/feed.html");
});

// router.get("/facebook", passport.authenticate("facebook"));
// router.get(
//   "/facebook/callback",
//   passport.authenticate("facebook", {
//     successRedirect: "/redirect.html",
//     failureRedirect: "/login",
//   })
// );
module.exports = router;
