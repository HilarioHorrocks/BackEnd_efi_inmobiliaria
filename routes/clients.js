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

// GET perfil del cliente por id_usuario
router.get("/profile/:id_usuario", auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { id_usuario: req.params.id_usuario },
      include: [{ 
        model: User, 
        as: "usuario", 
        attributes: ["id", "nombre", "correo"] 
      }],
    })

    if (!client) {
      // Si no existe cliente, crear uno básico
      const user = await User.findByPk(req.params.id_usuario)
      if (!user) {
        return res.status(404).json({ error: "Usuario no encontrado" })
      }

      const newClient = await Client.create({
        id_usuario: req.params.id_usuario,
        documento_identidad: 'PENDIENTE',
        telefono: null,
        direccion: null,
        fecha_nacimiento: null,
        profesion: null,
        estado_civil: null,
        ingresos_mensuales: null,
        preferencias: null
      })

      const clientWithUser = await Client.findByPk(newClient.id, {
        include: [{ 
          model: User, 
          as: "usuario", 
          attributes: ["id", "nombre", "correo"] 
        }],
      })

      return res.json(clientWithUser)
    }

    res.json(client)
  } catch (error) {
    console.error('Error obteniendo perfil:', error)
    res.status(500).json({ error: error.message })
  }
})

// PUT actualizar perfil del cliente por id_usuario
router.put("/profile/:id_usuario", auth, async (req, res) => {
  try {
    const client = await Client.findOne({
      where: { id_usuario: req.params.id_usuario }
    })

    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" })
    }

    // Solo permitir actualizar ciertos campos
    const {
      documento_identidad,
      telefono,
      direccion,
      fecha_nacimiento,
      profesion,
      estado_civil,
      ingresos_mensuales,
      preferencias
    } = req.body

    await client.update({
      documento_identidad,
      telefono,
      direccion,
      fecha_nacimiento,
      profesion,
      estado_civil,
      ingresos_mensuales,
      preferencias
    })

    // Retornar el cliente actualizado con datos del usuario
    const updatedClient = await Client.findByPk(client.id, {
      include: [{ 
        model: User, 
        as: "usuario", 
        attributes: ["id", "nombre", "correo"] 
      }],
    })

    res.json(updatedClient)
  } catch (error) {
    console.error('Error actualizando perfil:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
