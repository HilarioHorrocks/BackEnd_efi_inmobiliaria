const { Sale, Property, Client } = require("../models")

const salesController = {
  // POST /sales
  create: async (req, res) => {
    try {
      const { id_propiedad, id_cliente, fecha_venta, monto_total } = req.body
      const sale = await Sale.create({
        id_propiedad,
        id_cliente,
        fecha_venta,
        monto_total,
        estado: "finalizada",
      })

      await Property.update({ estado: "vendida" }, { where: { id: id_propiedad } })

      res.status(201).json(sale)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // GET /sales/:id_usuario
  getByUser: async (req, res) => {
    try {
      const client = await Client.findOne({ 
        where: { id_usuario: req.params.id_usuario } 
      })
      
      if (!client) {
        return res.json([])
      }

      const sales = await Sale.findAll({
        where: { id_cliente: client.id },
        include: [
          { model: Property, as: "propiedad" },
          { model: Client, as: "cliente" },
        ],
        order: [['fecha_venta', 'DESC']]
      })
      
      console.log(`Ventas encontradas para usuario ${req.params.id_usuario}:`, sales.length)
      res.json(sales)
    } catch (error) {
      console.error('Error obteniendo ventas:', error)
      res.status(500).json({ error: error.message })
    }
  },

  // PUT /sales/:id
  update: async (req, res) => {
    try {
      const sale = await Sale.findByPk(req.params.id)
      if (!sale) {
        return res.status(404).json({ error: "Venta no encontrada" })
      }

      await sale.update(req.body)
      res.json(sale)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // DELETE /sales/:id
  cancel: async (req, res) => {
    try {
      const sale = await Sale.findByPk(req.params.id)
      if (!sale) {
        return res.status(404).json({ error: "Venta no encontrada" })
      }

      await sale.update({ estado: "cancelada" })
      
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
  },

  // DELETE /sales/:id/remove
  remove: async (req, res) => {
    try {
      const sale = await Sale.findByPk(req.params.id)
      if (!sale) {
        return res.status(404).json({ error: "Venta no encontrada" })
      }

      const propertyId = sale.id_propiedad

      await sale.destroy()
      
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
  },

  // POST /sales/purchase
  purchaseProperty: async (req, res) => {
    try {
      const { id_propiedad } = req.body
      const id_usuario = req.user.id

      if (req.user.rol !== 'cliente') {
        return res.status(403).json({ error: "Solo los clientes pueden comprar propiedades" })
      }

      const property = await Property.findByPk(id_propiedad)
      if (!property) {
        return res.status(404).json({ error: "Propiedad no encontrada" })
      }
      if (property.estado !== 'disponible') {
        return res.status(400).json({ error: "Esta propiedad ya no está disponible" })
      }

      let client = await Client.findOne({ where: { id_usuario: id_usuario } })
      if (!client) {
        client = await Client.create({
          id_usuario: id_usuario,
          documento_identidad: 'PENDIENTE',
          telefono: 'PENDIENTE',
          direccion: 'PENDIENTE'
        })
      }

      const sale = await Sale.create({
        id_propiedad: id_propiedad,
        id_cliente: client.id,
        fecha_venta: new Date(),
        monto_total: property.precio,
        estado: "finalizada",
        monto_comision: property.precio * 0.03,
        porcentaje_comision: 3,
        forma_pago: "contado",
        observaciones: "Compra realizada desde la aplicación web"
      })

      await Property.update({ estado: "vendida" }, { where: { id: id_propiedad } })

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
  },
}

module.exports = salesController
