require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const client = require("./configs/db");
const port = process.env.PORT || 8200;

const authRoutes = require("./routes/auth");

app.use(express.json());
app.use(cors());

client.connect((err) => {
  if (err) {
    // console.log("inside error")
    console.log(err);
  } else {
    console.log("Connected to database!");
  }
});
app.get("/", (req, res) => {
  res.status(200).send("Server is up and running..!");
});
app.use("/auth", authRoutes);
app.listen(port, () => {
  console.log("hey there!");
});
