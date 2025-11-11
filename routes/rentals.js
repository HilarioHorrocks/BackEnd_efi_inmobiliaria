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
    // Primero buscar el cliente asociado al usuario
    const client = await Client.findOne({ where: { id_usuario: req.params.id_usuario } })
    
    if (!client) {
      // Si no hay cliente, devolver array vacío
      return res.json([])
    }

    // Buscar alquileres del cliente
    const rentals = await Rental.findAll({
      where: { id_cliente: client.id },
      include: [
        { model: Property, as: "propiedad" },
        { model: Client, as: "cliente" },
      ],
      order: [['createdAt', 'DESC']]
    })
    res.json(rentals)
  } catch (error) {
    console.error('Error obteniendo alquileres:', error)
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

    // Actualizar estado de alquiler a cancelado
    await rental.update({ estado: "cancelado" })
    
    // Volver a poner la propiedad como disponible
    await Property.update(
      { estado: "disponible" }, 
      { where: { id: rental.id_propiedad } }
    )
    
    console.log(`Alquiler ${rental.id} cancelado y propiedad ${rental.id_propiedad} disponible nuevamente`)
    res.json({ message: "Alquiler cancelado y propiedad disponible nuevamente" })
  } catch (error) {
    console.error('Error cancelando alquiler:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST alquiler directo por cliente
router.post("/rent", auth, async (req, res) => {
  try {
    const { 
      id_propiedad, 
      duracion_meses = 12,
      fecha_inicio,
      fecha_fin,
      monto_mensual,
      monto_deposito,
      monto_administracion = 0,
      renovacion_automatica = false,
      servicios_incluidos = [],
      observaciones = ''
    } = req.body
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

    // Usar fechas del formulario o calcular automáticamente
    let fechaInicio, fechaFin
    if (fecha_inicio && fecha_fin) {
      fechaInicio = new Date(fecha_inicio)
      fechaFin = new Date(fecha_fin)
    } else {
      fechaInicio = new Date()
      fechaFin = new Date()
      fechaFin.setMonth(fechaFin.getMonth() + duracion_meses)
    }

    // Usar monto mensual del formulario o calcularlo
    const montoMensual = monto_mensual || Math.round(property.precio / 100)
    const montoDeposito = monto_deposito || (montoMensual * 2)

    // Crear el alquiler
    const rental = await Rental.create({
      id_propiedad: id_propiedad,
      id_cliente: client.id,
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin,
      monto_mensual: montoMensual,
      estado: "activo", // Cambiado de "pendiente" a "activo"
      monto_deposito: montoDeposito,
      monto_administracion: monto_administracion,
      numero_contrato: `CONT-${Date.now()}`,
      servicios_incluidos: servicios_incluidos,
      renovacion_automatica: renovacion_automatica,
      observaciones: observaciones
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
        monto_mensual: montoMensual,
        duracion_meses: Math.round((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24 * 30)),
        monto_deposito: montoDeposito,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      }
    })
  } catch (error) {
    console.error('Error en alquiler:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
