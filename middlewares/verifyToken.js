const jwt = require('jsonwebtoken');
const client = require('../configs/db')
exports.verifyToken = (req,res,next) => {
    const token = req.headers.authorization;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if(err) {
            res.status(500).json({message: "Server error"});
        }else{
            const userEmail = decoded.email;
            client.query(`SELECT * FROM users WHERE email = '${userEmail}'`).then((data) => {
                if(data.rows == null){
                    res.status(400).json({message: "Sign In first"});
                }else{
                    req.email = userEmail;
                   
                    next();
                     
                }
            }).catch((err) => {
                res.status(500).json({message: "Data Error"});
            })
        }
      });
}