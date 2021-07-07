require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

// node mailer
const nodemailer = require("nodemailer");

// creating a transporter mail
// need to provide the service your using, email and password of the service
const transporter = nodemailer.createTransport({
  service: "gmail",  // using gmail to send feedback to self
  auth: {
    user: process.env.GMAIL, // here provide email
    pass: process.env.GPASS, // here provide password
  },
});

// route to send feedback to self mail
exports.sendmail = (req, res) => {
  // storing mail of the user which is sending feedback
  const fromMail=req.email;
  // creating options to send mail such as from, to, subject, text & html
  const options = {
    from: process.env.GMAIL,
    to: process.env.GMAIL,
    subject: "Feedback",
    text: `From:`,
    html: `<p>From: ${fromMail}<br>Feedback: ${req.body.feedback}</p>`,
  };
  // now sending self mail with the help of transporter & given options
  transporter.sendMail(options, (err, info) => {
    if (err) { // if any error occurs while sending mail
      console.log(err);
      res.status(500).json({
        error: "server error occured!",
      });
    } else { // if mail sent successful, then send 200 response
      res.status(200).json({
        message: "feedback sent successful",
      });
    }
  });
};

