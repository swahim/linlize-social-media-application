const express = require("express");
const router = express.Router();
const cors = require("cors");
const {
  getpics,
  newprofilepic,
  profile,
  createnewpost,
  getallposts,
  updatelike,
  updatedislike,
  updatepost,
  deletepost,
} = require("../controllers/post");
const { verifyToken } = require("../middlewares/verifyToken");
const app = express();
app.use(express.json());
app.use(cors());

// router.post("/newprofilepic", newprofilepic);
router.post("/getpics", verifyToken, getpics);
router.get("/profile/:username", profile);
router.post("/createnewpost", verifyToken, createnewpost);
router.post("/getallposts", verifyToken, getallposts);
router.put("/updatelike/:postid", verifyToken, updatelike);
router.delete("/updatedislike/:postid", verifyToken,updatedislike);
router.put("/updatepost/:postid", verifyToken, updatepost);
router.delete("/deletepost/:postid", verifyToken, deletepost);
module.exports = router;
