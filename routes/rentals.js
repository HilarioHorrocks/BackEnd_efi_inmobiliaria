const express = require("express")
const { Rental, Property, Client } = require("../models")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

// POST crear alquiler
router.post("/", auth, async (req, res) => {
  try {
    const { id_propiedad, id_cliente, fecha_inicio, fecha_fin, monto_mensual } = req.body
    const rental = await Rental.create({
      id_propiedad,
      id_cliente,
      fecha_inicio,
      fecha_fin,
      monto_mensual,
      estado: "activo",
    })

    // Actualizar estado de propiedad
    await Property.update({ estado: "alquilada" }, { where: { id: id_propiedad } })

    res.status(201).json(rental)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET alquileres por usuario
router.get("/:id_usuario", auth, async (req, res) => {
  try {
    const rentals = await Rental.findAll({
      where: { id_cliente: req.params.id_usuario },
      include: [
        { model: Property, as: "propiedad" },
        { model: Client, as: "cliente" },
      ],
    })
    res.json(rentals)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT actualizar alquiler
router.put("/:id", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id)
    if (!rental) return res.status(404).json({ error: "Alquiler no encontrado" })

    await rental.update(req.body)
    res.json(rental)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE cancelar alquiler
router.delete("/:id", auth, async (req, res) => {
  try {
    const rental = await Rental.findByPk(req.params.id)
    if (!rental) return res.status(404).json({ error: "Alquiler no encontrado" })

    await rental.update({ estado: "cancelado" })
    res.json({ message: "Alquiler cancelado" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
