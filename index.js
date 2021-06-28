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

const passportSetup = require("./configs/passport-setup");
const passport = require("passport");
const fileUploader = require("express-fileupload");
app.use(fileUploader());
app.use(express.json());
app.use(cors());

var server = app.listen(port, () => {
  console.log("On port 8000!");
});

// app.listen(port, () => {
//   console.log("On port 8000!");
// });

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/pages");
});

app.use(passport.initialize());
app.use(passport.session());
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);
app.use("/details", detailsRoutes);

//socket setup
const formatMessage = require("./utils/messageFormat");
const { userJoin, getCurrentUser } = require("./utils/users");
var io = socket(server);

io.on("connection", function (socket) {
  console.log("made socket connection", socket.id);
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);
    socket.emit("message", formatMessage("Bot", "Welcome to the chat"));

    socket.on("chat", (data) => {
      const user= getCurrentUser(socket.id);

      io.to(user.room).emit("chat", formatMessage(user.username, data.message));
    });

    socket.on("typing", (data) => {
      const user= getCurrentUser(socket.id);
      socket.broadcast.to(socket.id).emit("typing", data);
    });
  });
});

// client.connect((err) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Connected to database!");
//   }
// });
