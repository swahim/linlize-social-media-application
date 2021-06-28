require("dotenv").config();
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors())
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/redirect',
},
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
  }
));

//FOR NOW WE ARE NOT USING FACEBOOK AUTHENTICATION, KEPT FOR FUTURE PROJECT

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "/auth/facebook/callback",
  profileFields   : ['id','displayName','name','gender','picture.type(large)','emails']
},
function(accessToken, refreshToken, profile, cb) {
  // console.log(profile);
  // console.log("after");
  // console.log(profile.name.familyName);
  // console.log(profile.displayName);
  // console.log(profile.photos[0].value);
  // console.log(profile.emails[0].value);
  return cb(null, profile);
}
));
passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });