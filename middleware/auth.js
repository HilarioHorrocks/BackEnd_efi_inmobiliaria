const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  try {
    console.log('🔐 Auth middleware - Headers:', req.headers.authorization)
    const token = req.headers.authorization?.split(" ")[1]
    if (!token) {
      console.log('❌ No token provided')
      return res.status(401).json({ error: "Token no proporcionado" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key")
    console.log('✅ Token decoded:', decoded)
    req.user = decoded
    next()
  } catch (error) {
    console.log('❌ Token verification failed:', error.message)
    res.status(401).json({ error: "Token inválido" })
  }
}

const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ error: "Acceso denegado" })
    }
    next()
  }
}

module.exports = { auth, checkRole }
