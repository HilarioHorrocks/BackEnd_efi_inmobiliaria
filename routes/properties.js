const express = require("express")
const { Property, User } = require("../models")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

// GET todas las propiedades
router.get("/", async (req, res) => {
  try {
    const where = {}
    if (req.query.estado) where.estado = req.query.estado
    if (req.query.tipo) where.tipo = req.query.tipo

    const properties = await Property.findAll({
      where,
      include: [{ model: User, as: "agente", attributes: ["id", "nombre", "correo"] }],
    })

    res.json(properties)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// POST crear propiedad
router.post("/", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const { direccion, tipo, precio, estado, descripcion, tamano } = req.body
    const property = await Property.create({
      direccion,
      tipo,
      precio,
      estado: estado || "disponible",
      descripcion,
      tamano,
      id_agente: req.user.id,
    })
    res.status(201).json(property)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT actualizar propiedad
router.put("/:id", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id)
    if (!property) return res.status(404).json({ error: "Propiedad no encontrada" })

    await property.update(req.body)
    res.json(property)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE eliminar propiedad
router.delete("/:id", auth, checkRole("admin"), async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id)
    if (!property) return res.status(404).json({ error: "Propiedad no encontrada" })

    await property.destroy()
    res.json({ message: "Propiedad eliminada" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
