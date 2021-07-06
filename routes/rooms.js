require("dotenv").config();

const express = require("express");
const router = express.Router();

const { verifyToken } = require("../middlewares/verifyToken");
const {  joinroom } = require("../controllers/rooms");
const app = express();
app.use(express.json());

router.post("/joinroom/:room", verifyToken, joinroom);
module.exports = router;
