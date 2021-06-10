const jwt = require("jsonwebtoken");
const client = require("../configs/db");

const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID =
  "459450636110-kjiimp7ejasn59glq1rtm8484pc5rgrn.apps.googleusercontent.com";
const client_google = new OAuth2Client(CLIENT_ID);

exports.verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  const googletoken = req.headers.googleauthtoken;
  if (token) {
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(500).json({ message: "Server error" });
      } else {
        const userEmail = decoded.email;
        client
          .query(`SELECT * FROM users WHERE email = '${userEmail}'`)
          .then((data) => {
            if (data.rows == null) {
              res.status(400).json({ message: "Sign In first" });
            } else {
              req.email = userEmail;
              next();
            }
          })
          .catch((err) => {
            res.status(500).json({ message: "Data Error" });
          });
      }
    });
  } else if (googletoken) {
    token = req.headers.googleauthtoken;
    async function verify() {
      const ticket = await client_google.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload["sub"];
    }
    verify()
      .then(() => {
        console.log("google auth verified");
        next();
      })
      .catch(console.error);
  }
};
