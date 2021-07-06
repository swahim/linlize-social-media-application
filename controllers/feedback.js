require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// node mailer
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL,
    pass: process.env.GPASS,
  },
});
exports.sendmail = (req, res) => {
  console.log("in feedback");
  console.log(req.body);
  console.log(req.email);
  const fromMail=req.email;
  const options = {
    from: process.env.GMAIL,
    to: process.env.GMAIL,
    subject: "Feedback",
    text: `From:`,
    html: `<p>From: ${fromMail}<br>Feedback: ${req.body.feedback}</p>`,
  };
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({
        error: "server error occured!",
      });
    } else {
      res.status(200).json({
        message: "feedback sent successful",
      });
      console.log(info.response);
    }
  });
};

exports.test = (req, res) => {
  res.send("test");
};
