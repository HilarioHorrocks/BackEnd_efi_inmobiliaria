const express = require("express")
const { Client, User } = require("../models")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

// GET lista de clientes
router.get("/", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const clients = await Client.findAll({
      include: [{ model: User, as: "usuario", attributes: ["id", "nombre", "correo"] }],
    })
    res.json(clients)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST crear cliente
router.post("/", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const { documento_identidad, telefono, id_usuario } = req.body
    const client = await Client.create({
      documento_identidad,
      telefono,
      id_usuario,
    })
    res.status(201).json(client)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT actualizar cliente
router.put("/:id", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id)
    if (!client) return res.status(404).json({ error: "Cliente no encontrado" })

    await client.update(req.body)
    res.json(client)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE eliminar cliente
router.delete("/:id", auth, checkRole("admin"), async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id)
    if (!client) return res.status(404).json({ error: "Cliente no encontrado" })

    await client.destroy()
    res.json({ message: "Cliente eliminado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
