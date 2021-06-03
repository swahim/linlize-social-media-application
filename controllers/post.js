const client = require("../configs/db");
const express = require("express");
const cors = require("cors");
const app = express();
const fileUpload = require("express-fileupload");
const e = require("express");
app.use(fileUpload());
app.use(express.json());
app.use(cors());

exports.newprofilepic = (req, res) => {
  // <form
  //     action="http://localhost:8200/posts/newprofilepic"
  //     enctype="multipart/form-data"
  //     method="POST"
  //   >
  //     <input type="text" placeholder="email id" name="emailid"/>
  //     <input type="file" name="pic" />
  //     <input type="submit" value="Upload a file" />
  //   </form>

  // SUPPOST THIS IS POST REQUEST,
  //WE WILL BE STORING IMAGE FILE IN DATA VARIABLE USING EXPRESS FILE FILEUPLOADER
  // GET THER USER EMAIL FROM POST REQ BODY
  const data = req.files.pic;
  // SENDING DECODED BUFFER
  const imgdata = data.data.toString("base64");
  const email = req.body.email;
  if (data) {
    // WRITING A CLIENT QUERY WHERE WE CAN STORE IMAGE NAME, IMAGE, EMAIL IN OUT DATABASE
    client
      .query(
        `INSERT INTO profilepic (imgname, img, email) VALUES ('${data.name}', bytea('${imgdata}') , '${email}');`
      )
      // IF THERE IS ANY ERROR, IT WILL CONSOLE LOG
      .catch((err) => {
        console.log(err);
      });

    // WILL SEND A 200 STATUS IF IMAGE IS SUCCEFULLY ADDED INTO OUR DATABASE
    res.status(200).json({
      message: "image added successfully",
      data: req.files.pic,
    });
  }
  // SEND A 400 RES STATUS IF IMAGE IS NOT FOUND
  else {
    res.status(400).json({
      message: "image not found",
    });
  }
};

exports.getpics = (req, resp) => {
  let email = req.body.email;
  console.log(email);
  let image = '';
  let mime = '';
  client
   .query(`SELECT img, mime FROM profilepic WHERE email = '${email}'`)
   .then((res) => {
     image = res.rows[0].img;
     mime = res.rows[0].mime;
     resp.status(200).json({
       message: "image fetched successfully",
       data: `<img src='data:${mime};base64,${image}'>`
     })
   })
   .catch(e => resp.send('User Not Found'));
  // let img_length = 0;
  // let bg_images = [];
  // let mime =[];
  // client
  //   .query('SELECT img, mime FROM profilepic WHERE')
 
  //   .then((res) => {
  //   img_length = res.rows.length;
  //   res.rows.forEach((data) => {
  //     bg_images.push(data.img);
      
  //     mime.push((data.mime).toString('base64'));
  //   });
  //   console.log(bg_images);
  //   console.log(img_length)
  //   resp.render('img', {img_length:img_length , mime:mime, image:bg_images});
  //   })
  //   .catch(e => console.error(e.stack));

    
}
// exports.test = (req, res) => {};
