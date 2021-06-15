const express = require("express");
const { getdetails, updatedetails } = require("../controllers/details");
const router = express.Router();
const app = express();
const { verifyToken } = require("../middlewares/verifyToken");

app.use(express.json());

router.get("/getdetails", verifyToken, getdetails);
router.post("/updatedetails", verifyToken, updatedetails);
module.exports = router;
