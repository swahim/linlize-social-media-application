const express = require("express");
const { sendmail } = require("../controllers/feedback");
const router = express.Router();
const app = express();
const { verifyToken } = require("../middlewares/verifyToken");

app.use(express.json());

router.put("/sendmail", verifyToken, sendmail);
module.exports = router;
