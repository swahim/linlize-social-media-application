require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const app = express();
const imageToBase64 = require("image-to-base64");

app.use(express.json());

exports.getdetails = (req, res) => {
  console.log("in get details");
  let image = "";
  let mime = "";
  client
    .query(`SELECT * FROM details WHERE email='${req.email}';`)
    .then((data) => {
      userData = data.rows;
      image = data.rows[0].img;
      mime = data.rows[0].mime;
      if (userData.length === 0) {
        res.status(400).json({
          message: "user does not exis!",
        });
      } else {
        res.status(200).json({
          message: "profile fetched successfully",
          email: userData[0].email,
          username: userData[0].username,
          firstname: userData[0].firstname,
          lastname: userData[0].lastname,
          phonenumber: userData[0].phonenumber,
          bio: userData[0].bio,
          company: userData[0].company,
          designation: userData[0].designation,
          gender: userData[0].gender,
          dob: userData[0].dob,
          data: `data:${mime};base64,${image}`,
        });
      }
    });
};

exports.updatedetails = (req, res) => {
  console.log("in update details");
  if (req.files) {
    const data = req.files.image;
    const imgdata = data.data.toString("base64");
    const mime = data.mimetype;
    console.log(req.body.birthday);
    console.log(typeof req.body.birthday);
    client
      .query(
        `UPDATE details SET img='${imgdata}', mime='${mime}', firstname='${req.body.firstname}', lastname='${req.body.lastname}',  phonenumber='${req.body.phonenumber}', bio='${req.body.bio}', company='${req.body.company}', designation='${req.body.designation}', gender='${req.body.gender}', dob='${req.body.birthday}' WHERE email='${req.email}'`
      )
      .then((data) => {
        res.status(200).json({
          message: "details updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "database error occured!",
        });
      });
  } else {
    client
      .query(
        `UPDATE details SET firstname='${req.body.firstname}', lastname='${req.body.lastname}',  phonenumber='${req.body.phonenumber}', bio='${req.body.bio}', company='${req.body.company}', designation='${req.body.designation}', gender='${req.body.gender}', dob='${req.body.birthday}' WHERE email='${req.email}'`
      )
      .then((data) => {
        res.status(200).json({
          message: "details updated successfully",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "database error occured!",
        });
      });
  }
};
