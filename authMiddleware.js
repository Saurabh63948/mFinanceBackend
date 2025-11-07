



const jwt = require("jsonwebtoken")

const JWT_SECRET = process.env.JWT_SECRET || "mysingh-ancnbd"

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]

  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, message: "Invalid or expired token" })
    }

    req.user = user
    next()
  })
}

const adminOnly = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ success: false, message: "Admin access required" })
  }
  next()
}

module.exports = { authenticateToken, adminOnly }
