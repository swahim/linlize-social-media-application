require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const socket=require("socket.io");
const client = require("./configs/db");
const port = process.env.PORT || 8000;

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const fileUploader = require("express-fileupload");
app.use(fileUploader());
app.use(express.json());
app.use(cors());

// var server=app.listen(port, () => {
//   console.log("On port 8000!");
// });

app.listen(port, () => {
  console.log("On port 8000!");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

//static files
app.use(express.static('public'));


// //socket setup
// var io=socket(server);
// io.on('connection', function(socket){
//   console.log("made socket connection");

//   socket.on('chat',function(data){
//     io.sockets.emit('chat',data);
//   });

//   socket.on('typing',function(data){
//     socket.broadcast.emit('typing',data)
//   })
// })
client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database!");
  }
});

