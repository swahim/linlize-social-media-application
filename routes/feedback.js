const express = require("express");
const { feedback, test, sendmail } = require("../controllers/feedback");
const router = express.Router();
const app = express();
const { verifyToken } = require("../middlewares/verifyToken");

app.use(express.json());

router.put("/sendmail", verifyToken, sendmail);
router.post("/test", test);
module.exports = router;
