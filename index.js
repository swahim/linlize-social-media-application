require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const socket = require("socket.io");
const client = require("./configs/db");
const port = process.env.PORT || 8000;

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const detailsRoutes = require("./routes/details");
const roomsRoutes = require("./routes/rooms");

const passportSetup = require("./configs/passport-setup");
const passport = require("passport");
const fileUploader = require("express-fileupload");
app.use(fileUploader());
app.use(express.json());
app.use(cors());

var server = app.listen(port, () => {
  console.log("On port 8000!");
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/pages");
});

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/rooms", roomsRoutes);
app.use("/details", detailsRoutes);

//socket setup
const formatMessage = require("./utils/messageFormat");
const { userJoin, getCurrentUser } = require("./utils/users");
var io = socket(server);

const jwt = require("jsonwebtoken");

io.on("connection", function (socket) {
  console.log("made socket connection", socket.id);
  socket.on("joinRoom", ({ username, room }) => {
    var userId = "",
      user_id = "";
    console.log("room id in socket " + room);
    jwt.verify(room, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        console.log(err);
      }
      userId = decoded.userId;
      user_id = decoded.user_id;
      room = room.split(".")[1];
      console.log(userId, user_id, room);
    });
    console.log(room);
    room = "test";
    const user = userJoin(socket.id, user_id, room);

    socket.join(user.room);
    socket.emit("message", formatMessage("Bot", "Welcome to the chat"));

    socket.on("chat", (data) => {
      const user = getCurrentUser(socket.id);
      console.log("chat " + user.room);
      io.to(user.room).emit("chat", formatMessage(user.username, data.message));
    });

    socket.on("typing", (data) => {
      const user = getCurrentUser(socket.id);
      socket.broadcast.to(socket.id).emit("typing", data);
    });
  });
});

// node mailer
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bandarysohan24@gmail.com",
    pass: "Nokia@114",
  },
});
const options = {
  from: "outlook_38288AF31E2B69A0@outlook.com",
  to: "bandarysohan24@gmail.com",
  subject: "sending email with node",
  text: "a test email",
};
// transporter.sendMail(options, (err, info) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(info.response);
//   }
// });
client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database!");
  }
});
