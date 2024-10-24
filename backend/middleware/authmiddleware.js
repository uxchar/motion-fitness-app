// JWT verification middleware
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = (req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = decoded.id;
    next();
  });
};

module.exports = validateToken;
