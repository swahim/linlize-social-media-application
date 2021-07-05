require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cors());

exports.createroom = (req, res) => {
  console.log("in create room");
  const userId = req.params.userid; // which user wants to text
  const user_id = req.user_id; // user that is logged in
  const room = jwt.sign(
    {
      userId: userId,
      user_id: user_id,
    },
    process.env.SECRET_KEY
  );
  console.log(room);
  res.status(200).json({
    message: "room created successfully",
    room: room,
    user_id: user_id,
  });
};
