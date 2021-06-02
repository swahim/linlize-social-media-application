const express = require("express");
const router = express.Router();
const cors = require("cors");
const { getpic, newprofilepic } = require("../controllers/post");
const app = express();
app.use(express.json());
app.use(cors());

router.post("/newprofilepic", newprofilepic);


module.exports = router;
