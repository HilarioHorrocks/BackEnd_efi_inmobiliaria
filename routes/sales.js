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
    // Primero encontrar el cliente asociado al usuario
    const client = await Client.findOne({ 
      where: { id_usuario: req.params.id_usuario } 
    })
    
    if (!client) {
      return res.json([]) // Si no hay cliente, retornar array vacío
    }

    // Buscar ventas del cliente
    const sales = await Sale.findAll({
      where: { id_cliente: client.id },
      include: [
        { model: Property, as: "propiedad" },
        { model: Client, as: "cliente" },
      ],
      order: [['fecha_venta', 'DESC']] // Ordenar por fecha más reciente
    })
    
    console.log(`Ventas encontradas para usuario ${req.params.id_usuario}:`, sales.length)
    res.json(sales)
  } catch (error) {
    console.error('Error obteniendo ventas:', error)
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

    // Actualizar estado de venta a cancelada
    await sale.update({ estado: "cancelada" })
    
    // Volver a poner la propiedad como disponible
    await Property.update(
      { estado: "disponible" }, 
      { where: { id: sale.id_propiedad } }
    )
    
    console.log(`Venta ${sale.id} cancelada y propiedad ${sale.id_propiedad} disponible nuevamente`)
    res.json({ message: "Venta cancelada y propiedad disponible nuevamente" })
  } catch (error) {
    console.error('Error cancelando venta:', error)
    res.status(500).json({ error: error.message })
  }
})

// DELETE eliminar venta completamente (solo para admins)
router.delete("/:id/remove", auth, checkRole("admin"), async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id)
    if (!sale) return res.status(404).json({ error: "Venta no encontrada" })

    const propertyId = sale.id_propiedad

    // Eliminar la venta completamente
    await sale.destroy()
    
    // Volver a poner la propiedad como disponible
    await Property.update(
      { estado: "disponible" }, 
      { where: { id: propertyId } }
    )
    
    console.log(`Venta ${req.params.id} eliminada completamente y propiedad ${propertyId} disponible nuevamente`)
    res.json({ message: "Venta eliminada completamente y propiedad disponible nuevamente" })
  } catch (error) {
    console.error('Error eliminando venta:', error)
    res.status(500).json({ error: error.message })
  }
})

// POST compra directa por cliente
router.post("/purchase", auth, async (req, res) => {
  try {
    const { id_propiedad } = req.body
    const id_usuario = req.user.id

    // Verificar que el usuario sea cliente
    if (req.user.rol !== 'cliente') {
      return res.status(403).json({ error: "Solo los clientes pueden comprar propiedades" })
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

    // Crear la venta
    const sale = await Sale.create({
      id_propiedad: id_propiedad,
      id_cliente: client.id,
      fecha_venta: new Date(),
      monto_total: property.precio,
      estado: "pendiente", // Estado inicial para compras directas
      monto_comision: property.precio * 0.03, // 3% de comisión
      porcentaje_comision: 3,
      forma_pago: "contado", // Forma de pago por defecto
      observaciones: "Compra realizada desde la aplicación web"
    })

    // Actualizar estado de propiedad
    await Property.update({ estado: "vendida" }, { where: { id: id_propiedad } })

    // Obtener la venta completa con relaciones
    const completeSale = await Sale.findByPk(sale.id, {
      include: [
        { model: Property, as: 'propiedad' },
        { model: Client, as: 'cliente' }
      ]
    })

    res.status(201).json({
      success: true,
      message: "¡Compra procesada exitosamente!",
      sale: completeSale
    })
  } catch (error) {
    console.error('Error en compra:', error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
