const express = require("express");
const router = express.Router();
const cors = require("cors");
const { getpics, newprofilepic, profile } = require("../controllers/post");
const { verifyToken } = require("../middlewares/verifyToken");
const app = express();
app.use(express.json());
app.use(cors());

router.post("/newprofilepic" ,newprofilepic);
router.post("/getpics" ,getpics);
router.get("/profile/:username", profile);

module.exports = router;
