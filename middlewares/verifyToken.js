const jwt = require("jsonwebtoken");
const client = require("../configs/db");

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "459450636110-kjiimp7ejasn59glq1rtm8484pc5rgrn.apps.googleusercontent.com";
const client_google = new OAuth2Client(CLIENT_ID);

exports.verifyToken = (req, res, next) => {
  // let token = null;
  // let googleauthtoken = null;
  // console.log(req.headers);
  let token = req.headers.authorization;
  let googleauthtoken = req.headers.googleauthtoken;
  // console.log(token, googleauthtoken);
  // console.log(req.headers);
  if (token !== "null") {
    console.log("in token");
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(500).json({ message: "Server error" });
      } else {
        const userEmail = decoded.email;
        client
          .query(`SELECT * FROM details WHERE email = '${userEmail}'`)
          .then((data) => {
            if (data.rows == null) {
              res.status(400).json({ message: "Sign In first" });
            } else {
              console.log("in normal auth");
              console.log(userEmail);
              // req.email = userEmail;
              next();
            }
          })
          .catch((err) => {
            console.log(err);
            res.status(500).json({ message: "Data Error" });
          });
      }
    });
  } else if (googleauthtoken !== "null") {
    let userEmail = "";
    token = req.headers.googleauthtoken;
    async function verify() {
      const ticket = await client_google.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      userEmail = payload.email;
    }
    verify()
      .then(() => {
        req.email = userEmail;
        next();
      })
      .catch(err => {
        console.log(err);
        next(err);
      });
  }
};
