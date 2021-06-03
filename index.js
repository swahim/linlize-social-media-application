require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const client = require("./configs/db");
const port = process.env.PORT || 8000;

const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const fileUploader = require("express-fileupload");
app.use(fileUploader());
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Server is up and running..!");
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);


client.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Connected to database!");
  }
});

app.listen(port, () => {
  console.log("On port 8000!");
});
