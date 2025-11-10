const express = require("express")
const { User, Client } = require("../models")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

// GET perfil del usuario autenticado
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["contraseña"] },
      include: [{ model: Client, as: "datosCliente" }],
    })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
