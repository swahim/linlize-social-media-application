const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const e = require("express");
app.use(fileUpload());
app.use(express.json());
app.use(cors());

// THIS ROUTE IS TO GET BASIC DETAILS, PROFILE PIC OF THE USER THAT IS LOGGED IN
exports.getpics = (req, resp) => {

  let image = "", mime = "", firstname = "", lastname = "", userid = "";
  client
    .query(
      `SELECT firstname, lastname, img, mime, userid FROM details WHERE email = '${req.email}'`
    )
    .then((res) => {
      // console.log(res);

      firstname = res.rows[0].firstname;
      lastname = res.rows[0].lastname;
      image = res.rows[0].img;
      mime = res.rows[0].mime;
      userid = res.rows[0].userid;
      resp.status(200).json({
        mime: mime,
        message: "image fetched successfully",
        data: `data:${mime};base64,${image}`,
        firstname: firstname,
        lastname: lastname,
        userid: userid,
      });
    })
    .catch((err) => {
      console.log(err);
      resp.status(500).json({
        message: "server error occured",
      });
    });
};
exports.profile = (req, res) => {
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
          username: userData[0].username,
          firstname: userData[0].firstname,
          lastname: userData[0].lastname,
          email: userData[0].email,
          phonenumber: userData[0].phonenumber,
          dob: userData[0].dob,
          data: `data:${mime};base64,${image}`,
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "server error occured!",
      });
    });
};

// ROUTE FOR CREATE NEW POST
// THIS ROUTE STORES POSTS IMAGE, CONTENT IN DATABSE
exports.createnewpost = (req, res) => {
  // storing the file in data variable
  const data = req.files.image;
  // converting image file to base64 and storing it in imgdata variable
  const imgdata = data.data.toString("base64");
  // storing mime type in mime variable
  const mime = data.mimetype;
  if (data) {
    // WRITING A CLIENT QUERY WHERE WE CAN STORE EMAIL, CONTENT, POST IMAGE, POST MIME IN OUT DATABASE
    client
      .query(
        `INSERT INTO posts (email, content, postsimg, postsmime) VALUES  ('${req.email}', '${req.body.content}', bytea('${imgdata}'), '${mime}');`
      )
      // DURING THIS PROCESS, IF ANY ERROR OCCURS
      .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: "database error occured!",
        })
      });
      // SENDING 200 RESPONSE WHEN POSTS CONTENT, IMAGE STORED IN DATABASE
    res.status(200).json({
      message: "image added successfully",
    });
  } else {
    res.status(400).json({
      message: "image not found",
    });
  }
};

// ROUTE TO GET ALL POSTS
exports.getallposts = (req, resp) => {
  // A VARIABLE TO STORE USERID, POSTID, POST IMAGE, USER PROFILE IAMGE, CONTENT, LIKES, COMPANY, DESIGNATION
  let temp = [];
  client
    .query(
      `SELECT postid, likes, userid, posts.email, content, firstname, lastname, company, designation, posts.postsimg, posts.postsmime, img, mime from posts INNER JOIN details ON posts.email=details.email ORDER BY postid DESC`
    )
    .then((res) => {
      res.rows.forEach((data) => {
        // STORING ALL THOSE VALUES IN INNERTEMP AND THEN APPENDING IT TO TEMP
        let innertemp = {
          postid: data.postid,
          userid: data.userid,
          email: data.email,
          logemail: req.email,
          firstname: data.firstname,
          lastname: data.lastname,
          company: data.company,
          designation: data.designation,
          content: data.content,
          likes: data.likes,
          mime: data.mime,
          profilepic: "data:" + data.mime + ";base64," + data.img,
          postspic: "data:" + data.postsmime + ";base64," + data.postsimg,
        };
        temp.push(innertemp);
      });
      // SENDING THE REQUIRED DATA AS A JSON OBJECT WITH A 200 RESPONSE
      resp.status(200).json({ temp });
    })
    // DURING THIS PROCESS, IF ANY ERROR OCCURS
    .catch((err) => {
      console.log(err);
      resp.status(500).json({
        message: "data error occured!",
      });
    });
};

// ROUTE FOR UPDATE LIKE
// THIS ROUTE APPEND USER EMAIL IN LIKES ARRAY 
exports.updatelike = (req, res) => {
  // QUERY TO APPEND USER EMAIL IN LIKE ARRAY COLUMN
  client
    .query(
      `UPDATE posts SET likes = array_append(likes, '${req.email}') WHERE postid='${req.params.postid}';`
    )
    // SENDING 200 RESPONSE STATUS
    .then((data) => {
      res.status(200).json({
        message: "updated like",
      });
    })
    // DURING THIS PROCESS, IF ANY ERROR OCCURS
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "database error occured!",
      });
    });
};

// ROUTE TO UPDATE DISLIKE
// THIS ROUTE REMOVES USER EMAIL FROM LIKE ARRAY COLUMN
exports.updatedislike = (req, res) => {
  // QUERY TO REMOVE USER'S EMAIL ID FROM LIKE ARRAY COLUMN IN DB
  client
    .query(
      `UPDATE posts SET likes = array_remove(likes, '${req.email}') WHERE postid='${req.params.postid}';`
    )
    // SENDING 200 RESPONSE STATUS
    .then((data) => {
      res.status(200).json({
        message: "updated dislike",
      });
    })
    // DURING THIS PROCESS, IF ANY ERROR OCCURS
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "database error occured!",
      });
    });
};

// ROUTE TO UPDATE POST
exports.updatepost = (req, res) => {
  // QUERY TO UPDATE POST CONTENT OF THE GIVEN POST WHERE POSTID =  REQ.PARAMS.POSTID
  // THIS ROUTE REQUIRES A MIDDLE WARE TO VERIFY JWT TOKEN
  // SO WITHOUT TOKEN USER CAN NOT EDIT POST
  client
    .query(
      `UPDATE posts SET content='${req.body.captionValue}' WHERE postid='${req.params.postid}'`
    )
    // SENDING 200 RESPONSE STATUS
    .then((data) => {
      res.status(200).json({
        message: "Post updated successfully,",
      });
    })
    // DURING THIS PROCESS, IF ANY ERROR OCCURS
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: "Server error occured!",
      });
    });
};

// ROUTE TO DELETE POST
exports.deletepost = (req, res) => {
  // QUERY  TO DELETE POST BY POSTID WHERE POSTID = REQ.PARAMS.postid
  // THIS ROUTE REQUIRES A MIDDLE WARE TO VERIFY JWT TOKEN
  // SO WITHOUT TOKEN USER CAN NOT DELTE POST
  client
    .query(`DELETE FROM posts WHERE postid ='${req.params.postid}'`)
    .then((data) => {
      //SENDING 200 RESPONSE STATUS
      res.status(200).json({
        message: "Post deleted successfully,",
      });
    })
    // DURING THIS PROCESS, IF ANY ERROR OCCURS
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        message: "Server error occured!",
      });
    });
};
