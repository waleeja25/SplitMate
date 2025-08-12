const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ success: false, message: "No token provided" });
}

const token = authHeader.split(" ")[1];


  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

const generateToken = (userData) => {
    return jwt.sign(userData, process.env.JWT_SECRET);
}

module.exports = {jwtAuthMiddleware, generateToken};