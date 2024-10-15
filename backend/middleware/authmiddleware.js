const jwt = require("jsonwebtoken");

const validateToken = (req, res, next) => {
  // get token
  const token = req.header("Authorization");

  // check if token is valid
  try {
    // if valid token setID and continue to next route
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    //if invalid token / no token sent back, unauthorized
    res.send("Invalid auth token");
  }
};

module.exports = validateToken;
