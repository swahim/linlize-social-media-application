
const express = require("express");
const router = express.Router();
const cors = require("cors");
const { newpost } = require("../controllers/post");
const app = express();
app.use(express.json());
app.use(cors());

router.post("/newpost", newpost);

module.exports = router;