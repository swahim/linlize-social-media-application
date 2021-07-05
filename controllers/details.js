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
          mime: mime,
          data: `data:${mime};base64,${image}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "database error occured!",
      });
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

exports.profile = (req, res) => {
  const userId = req.params.userid;
  let userEmail = "",
    temp = [];
  // console.log(userId);

  client
    .query(
      `SELECT firstname, lastname, company, designation, img, mime, email, bio FROM details WHERE userid='${userId}'`
    )
    .then((data) => {
      userEmail = data.rows[0].email;
      data = data.rows[0];
      let details = {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        company: data.company,
        designation: data.designation,
        bio: data.bio,
        mime: data.mime,
        // img: data.img,
        profilepic: "data:" + data.mime + ";base64," + data.img,
      };
      temp.push(details);
      client
        .query(
          `SELECT userid, img, mime from details WHERE email='${req.email}'`
        )
        .then((data) => {
          data = data.rows[0];
          let innerTemp = {
            // mime: data.mime,
            // img: data.img,
            userid: data.userid,
            profilepic: "data:" + data.mime + ";base64," + data.img,
          };
          temp.push(innerTemp);
        });

      client
        .query(
          // `SELECT firstname, lastname, details.email, bio, company, designation, img, mime, content, postsimg, postsmime, likes  FROM posts INNER JOIN details on posts.email=details.email WHERE details.email='${userEmail}';`
          `SELECT  content, postsimg, postsmime, postid, likes FROM posts WHERE email='${userEmail}' ORDER BY postid DESC;`
        )
        .then((data) => {
          let temp2 = [];
          data.rows.forEach((data) => {
            let posts = {
              content: data.content,
              postid: data.postid,
              likes: data.likes,
              postspic: "data:" + data.postsmime + ";base64," + data.postsimg,
            };
            temp2.push(posts);
          });
          temp.push(temp2);
          res.status(200).json(temp);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            message: "database error occured!",
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "database error occured!!",
      });
    });
};
