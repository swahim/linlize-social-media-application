const express = require("express");
const router = express.Router();
const cors = require("cors");
const { getpics, newprofilepic } = require("../controllers/post");
const app = express();
app.use(express.json());
app.use(cors());

router.post("/newprofilepic", newprofilepic);
router.post("/getpics", getpics);
// router.get("/test", test);

module.exports = router;
