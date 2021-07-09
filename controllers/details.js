require("dotenv").config();
const client = require("../configs/db");
const express = require("express");
const app = express();

app.use(express.json());

// getdeatils route
// this route is for completeprofile page
// this will give all the details of a user
exports.getdetails = (req, res) => {
  let image = "",
    mime = "";

  // getting all the details of user with the help of email by decoding token in middleware => verifyToken.js
  client
    .query(`SELECT * FROM details WHERE email='${req.email}';`)
    .then((data) => {
      userData = data.rows;
      // checking if users exists in dob
      // if userData.length is 0, then user doesn't exists
      if (userData.length === 0) {
        res.status(400).json({
          error: "user does not exis!",
        });
      } else {
        // user exists

        //storing image and mime in a variable
        image = data.rows[0].img;
        mime = data.rows[0].mime;
        // sending all the details of user as a json object
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

    // while fetching user details, if any error occurs,
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "database error occured!",
      });
    });
};

// update details route
// this route is for updating user details in complete profile page
exports.updatedetails = (req, res) => {
  // checking if client send a image file or not

  // if there is file, then
  if (req.files) {
    const data = req.files.image;
    // converting image file to base64
    const imgdata = data.data.toString("base64");
    // getting mimetype of file
    const mime = data.mimetype;
    // Query to store all the details of the user and image in our database
    // where email is decoded from jwt token in middleware/verifyToken.js
    client
      .query(
        `UPDATE details SET img='${imgdata}', mime='${mime}', firstname='${req.body.firstname}', lastname='${req.body.lastname}',  phonenumber='${req.body.phonenumber}', bio='${req.body.bio}', company='${req.body.company}', designation='${req.body.designation}', gender='${req.body.gender}', dob='${req.body.birthday}' WHERE email='${req.email}'`
      )
      .then((data) => {
        // sending 200 response after updating user details
        res.status(200).json({
          message: "details updated successfully",
        });
      })
      // during this process, if any error occurs
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "database error occured!",
        });
      });
  } else {
    //if there is no file

    // Query to store all the details of the user in our database
    // where email is decoded from jwt token in middleware/verifyToken.js
    client
      .query(
        `UPDATE details SET firstname='${req.body.firstname}', lastname='${req.body.lastname}',  phonenumber='${req.body.phonenumber}', bio='${req.body.bio}', company='${req.body.company}', designation='${req.body.designation}', gender='${req.body.gender}', dob='${req.body.birthday}' WHERE email='${req.email}'`
      )
      .then((data) => {
        // sending 200 response after updating user details
        res.status(200).json({
          message: "details updated successfully",
          data: data,
        });
      })

      // during this process, if any error occurs
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          message: "database error occured!",
        });
      });
  }
};
// profile route
// this route is for getting user details by giving user id with the help of params
exports.profile = (req, res) => {
  // getting user id form param
  const userId = req.params.userid;

  // storing all the details in a temp variable
  let userEmail = "",
    temp = [];

  // Query to get user details from user id
  client
    .query(
      `SELECT firstname, lastname, company, designation, img, mime, email, bio FROM details WHERE userid='${userId}'`
    )
    .then((data) => {
      userEmail = data.rows[0].email;
      data = data.rows[0];
      // storing basic details in a variable and appending it in temp
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

      // getting profile pic of user that is logged in
      client
        .query(
          `SELECT userid, img, mime from details WHERE email='${req.email}'`
        )
        .then((data) => {
          data = data.rows[0];
          // storing profile pic in a innerTemp and appending it in temp
          let innerTemp = {
            userid: data.userid,
            profilepic: "data:" + data.mime + ";base64," + data.img,
          };
          temp.push(innerTemp);
        });
      // getting posts from userEmail
      client
        .query(
          `SELECT  content, postsimg, postsmime, postid, likes FROM posts WHERE email='${userEmail}' ORDER BY postid DESC;`
        )
        .then((data) => {
          // storing the data in temp2 and appending it in temp
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
        // during this process, if any error occurs
        .catch((err) => {
          console.log(err);
          res.status(500).json({
            error: "database error occured!",
          });
        });
    })
    // during this process, if any error occurs
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "database error occured!!",
      });
    });
};

// search route
// this route sends basic details of all users
exports.search = (req, res) => {
  client
  .query(`SELECT firstname, lastname, userid FROM details`)
  .then((data) => {
    data=data.rows;
    res.status(200).json({
      data: data,
    })
  })
};