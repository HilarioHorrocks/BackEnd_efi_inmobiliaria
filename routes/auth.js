const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { User } = require("../models")

const router = express.Router()

router.post("/register", async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body

    const userExists = await User.findOne({ where: { correo } })
    if (userExists) return res.status(400).json({ error: "Usuario ya existe" })

    const hashedPassword = await bcrypt.hash(contraseña, 10)
    const user = await User.create({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: rol || "cliente",
    })

    res.status(201).json({
      message: "Usuario creado exitosamente",
      user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post("/login", async (req, res) => {
  try {
    const { correo, contraseña } = req.body
    const user = await User.findOne({ where: { correo } })

    if (!user) return res.status(400).json({ error: "Usuario no encontrado" })

    const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña)
    if (!isPasswordValid) return res.status(400).json({ error: "Contraseña incorrecta" })

    const token = jwt.sign(
      { id: user.id, correo: user.correo, rol: user.rol },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "24h" },
    )

    res.json({ token, user: { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol } })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
