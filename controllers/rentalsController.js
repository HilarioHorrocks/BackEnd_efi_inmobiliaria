const { Rental, Property, Client } = require("../models")

const rentalsController = {
  // POST /rentals
  create: async (req, res) => {
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

      await Property.update({ estado: "alquilada" }, { where: { id: id_propiedad } })

      res.status(201).json(rental)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // GET /rentals/:id_usuario
  getByUser: async (req, res) => {
    try {
      const client = await Client.findOne({ where: { id_usuario: req.params.id_usuario } })
      
      if (!client) {
        return res.json([])
      }

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
  },

  // PUT /rentals/:id
  update: async (req, res) => {
    try {
      const rental = await Rental.findByPk(req.params.id)
      if (!rental) {
        return res.status(404).json({ error: "Alquiler no encontrado" })
      }

      await rental.update(req.body)
      res.json(rental)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // DELETE /rentals/:id
  cancel: async (req, res) => {
    try {
      const rental = await Rental.findByPk(req.params.id)
      if (!rental) {
        return res.status(404).json({ error: "Alquiler no encontrado" })
      }

      await rental.update({ estado: "cancelado" })
      
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
  },

  // POST /rentals/rent
  rentProperty: async (req, res) => {
    try {
      const { id_propiedad, fecha_inicio, fecha_fin, monto_mensual, monto_deposito, monto_administracion, renovacion_automatica, servicios_incluidos, observaciones } = req.body
      const id_usuario = req.user.id

      if (req.user.rol !== 'cliente') {
        return res.status(403).json({ error: "Solo los clientes pueden alquilar propiedades" })
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

      const rental = await Rental.create({
        id_propiedad: id_propiedad,
        id_cliente: client.id,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        monto_mensual: monto_mensual,
        monto_deposito: monto_deposito || monto_mensual * 2,
        monto_administracion: monto_administracion || monto_mensual * 0.1,
        renovacion_automatica: renovacion_automatica || false,
        servicios_incluidos: JSON.stringify(servicios_incluidos || []),
        observaciones: observaciones || '',
        estado: "activo"
      })

      await Property.update({ estado: "alquilada" }, { where: { id: id_propiedad } })

      const completeRental = await Rental.findByPk(rental.id, {
        include: [
          { model: Property, as: 'propiedad' },
          { model: Client, as: 'cliente' }
        ]
      })

      res.status(201).json({
        success: true,
        message: "¡Alquiler procesado exitosamente!",
        rental: completeRental
      })
    } catch (error) {
      console.error('Error en alquiler:', error)
      res.status(500).json({ error: error.message })
    }
  },
}

module.exports = rentalsController
