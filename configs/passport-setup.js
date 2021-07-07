require("dotenv").config();
const passport = require("passport");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
var GoogleStrategy = require("passport-google-oauth20").Strategy;
var FacebookStrategy = require("passport-facebook").Strategy;

// Implementing  google strategy for google authentication.
// We need to provide client id, client secret given by google in google developer console.
// Give a call back url so that it redirects to a page when user is logged in.
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    // function to get profile details and a call back function
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

// Implementing  facebook strategy for facebook authentication.
// We need to provide client id, client secret given by facebook in facebook developer account.
// Give a call back url so that it redirects to a page when user is logged in.
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "emails",
      ],
    },
    // function to get profile details and a call back function
    function (accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
  )
);

// Passport serializer
passport.serializeUser(function (user, cb) {
  cb(null, user);
});

// Passport deserializer
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});
