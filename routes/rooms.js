require("dotenv").config();

const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");
const { createroom } = require("../controllers/rooms");
const app = express();
app.use(express.json());

router.post("/createroom/:userid", createroom);
module.exports = router;
