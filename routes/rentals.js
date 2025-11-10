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

// POST alquiler directo por cliente
router.post("/rent", auth, async (req, res) => {
  try {
    const { id_propiedad, duracion_meses = 12 } = req.body
    const id_usuario = req.user.id

    // Verificar que el usuario sea cliente
    if (req.user.rol !== 'cliente') {
      return res.status(403).json({ error: "Solo los clientes pueden alquilar propiedades" })
    }

    // Verificar que la propiedad existe y está disponible
    const property = await Property.findByPk(id_propiedad)
    if (!property) {
      return res.status(404).json({ error: "Propiedad no encontrada" })
    }
    if (property.estado !== 'disponible') {
      return res.status(400).json({ error: "Esta propiedad ya no está disponible" })
    }

    // Buscar o crear cliente
    let client = await Client.findOne({ where: { id_usuario: id_usuario } })
    if (!client) {
      // Crear cliente básico si no existe
      client = await Client.create({
        id_usuario: id_usuario,
        documento_identidad: 'PENDIENTE',
        telefono: 'PENDIENTE',
        direccion: 'PENDIENTE'
      })
    }

    // Calcular fechas
    const fecha_inicio = new Date()
    const fecha_fin = new Date()
    fecha_fin.setMonth(fecha_fin.getMonth() + duracion_meses)

    // Calcular monto mensual (estimado como precio/100 para alquiler)
    const monto_mensual = Math.round(property.precio / 100)

    // Crear el alquiler
    const rental = await Rental.create({
      id_propiedad: id_propiedad,
      id_cliente: client.id,
      fecha_inicio: fecha_inicio,
      fecha_fin: fecha_fin,
      monto_mensual: monto_mensual,
      estado: "pendiente", // Estado inicial para alquileres directos
      monto_deposito: monto_mensual * 2, // 2 meses de depósito
      numero_contrato: `CONT-${Date.now()}`,
      servicios_incluidos: ["agua", "internet"],
      renovacion_automatica: false
    })

    // Actualizar estado de propiedad
    await Property.update({ estado: "alquilada" }, { where: { id: id_propiedad } })

    // Obtener el alquiler completo con relaciones
    const completeRental = await Rental.findByPk(rental.id, {
      include: [
        { model: Property, as: 'propiedad' },
        { model: Client, as: 'cliente' }
      ]
    })

    res.status(201).json({
      success: true,
      message: "¡Alquiler procesado exitosamente!",
      rental: completeRental,
      details: {
        monto_mensual: monto_mensual,
        duracion_meses: duracion_meses,
        monto_deposito: monto_mensual * 2,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin
      }
    })
  } catch (error) {
    console.error('Error en alquiler:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
