const express = require("express")
const { Sale, Property, Client } = require("../models")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

// POST crear venta
router.post("/", auth, async (req, res) => {
  try {
    const { id_propiedad, id_cliente, fecha_venta, monto_total } = req.body
    const sale = await Sale.create({
      id_propiedad,
      id_cliente,
      fecha_venta,
      monto_total,
      estado: "finalizada",
    })

    // Actualizar estado de propiedad
    await Property.update({ estado: "vendida" }, { where: { id: id_propiedad } })

    res.status(201).json(sale)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// GET ventas por usuario
router.get("/:id_usuario", auth, async (req, res) => {
  try {
    const sales = await Sale.findAll({
      where: { id_cliente: req.params.id_usuario },
      include: [
        { model: Property, as: "propiedad" },
        { model: Client, as: "cliente" },
      ],
    })
    res.json(sales)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// PUT actualizar venta
router.put("/:id", auth, checkRole("admin", "agente"), async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id)
    if (!sale) return res.status(404).json({ error: "Venta no encontrada" })

    await sale.update(req.body)
    res.json(sale)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// DELETE cancelar venta
router.delete("/:id", auth, async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id)
    if (!sale) return res.status(404).json({ error: "Venta no encontrada" })

    await sale.update({ estado: "cancelada" })
    res.json({ message: "Venta cancelada" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
