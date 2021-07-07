const jwt = require("jsonwebtoken");
const client = require("../configs/db");

// token to verify users credentials
exports.verifyToken = (req, res, next) => {
  // get token from headers authorization
  const token = req.headers.authorization;
  // verify token by providing token, secret key
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    // if error occurs while validating jwt token
    if (err) {
      res.status(500).json({
        error: "server error occured",
      });
    }
    // storing user's email and user's id in variables
    const userEmail = decoded.email;
    const user_id = decoded.user_id;

    // checking if users exists with the decoded mail in our database or not
    client
      .query(`SELECT * FROM details WHERE email = '${userEmail}';`)
      .then((data) => {
        if (data.command.length === 0) {
          res.status(400).json({
            message: "invalid token",
          });
        } else {
          // if user exists then sending email and user id
          req.email = userEmail;
          req.user_id = user_id;
          next();
        }
      })
      // during this process, if any error occurs
      .catch((err) => {
        res.status(500).json({
          error: "database error occured",
        });
      });
  });
};
