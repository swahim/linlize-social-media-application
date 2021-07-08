const express = require("express");
const { getdetails, updatedetails, profile, search } = require("../controllers/details");
const router = express.Router();
const app = express();
const { verifyToken } = require("../middlewares/verifyToken");

app.use(express.json());

router.get("/getdetails", verifyToken, getdetails);
router.post("/updatedetails", verifyToken, updatedetails);
router.get("/profile/:userid", verifyToken, profile);
router.get("/search", search);
module.exports = router;
