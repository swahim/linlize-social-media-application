
const express = require("express");
const { signUp, signIn } = require("../controllers/auth");
const router = express.Router();
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
router.post("/signUp", signUp);
router.post("/signIn", signIn);

module.exports = router;