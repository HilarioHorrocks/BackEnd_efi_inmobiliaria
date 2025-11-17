const { Property, User } = require("../models")

const propertiesController = {
  // GET /properties
  getAll: async (req, res) => {
    try {
      const where = {}
      
      if (req.query.estado) {
        where.estado = req.query.estado
      } else {
        where.estado = 'disponible' 
      }
      
      if (req.query.tipo) where.tipo = req.query.tipo
      if (req.query.disponibilidad) where.disponibilidad = req.query.disponibilidad

      const properties = await Property.findAll({
        where,
        include: [{ model: User, as: "agente", attributes: ["id", "nombre", "correo"] }],
      })

      res.json(properties)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // POST /properties
  create: async (req, res) => {
    try {
      const { direccion, tipo, precio, estado, descripcion, tamano, disponibilidad } = req.body
      const property = await Property.create({
        direccion,
        tipo,
        precio,
        estado: estado || "disponible",
        disponibilidad: disponibilidad || 'ambos',
        descripcion,
        tamano,
        id_agente: req.user.id,
      })
      res.status(201).json(property)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // PUT /properties/:id
  update: async (req, res) => {
    try {
      const property = await Property.findByPk(req.params.id)
      if (!property) {
        return res.status(404).json({ error: "Propiedad no encontrada" })
      }

      const updatable = [
        'direccion', 'tipo', 'precio', 'estado', 'descripcion', 'tamano', 
        'habitaciones', 'banos', 'garajes', 'ciudad', 'codigo_postal', 
        'imagenes', 'caracteristicas', 'disponibilidad'
      ]
      const toUpdate = {}
      updatable.forEach((k) => { 
        if (req.body[k] !== undefined) toUpdate[k] = req.body[k] 
      })

      await property.update(toUpdate)
      res.json(property)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // DELETE /properties/:id
  delete: async (req, res) => {
    try {
      const property = await Property.findByPk(req.params.id)
      if (!property) {
        return res.status(404).json({ error: "Propiedad no encontrada" })
      }

      await property.destroy()
      res.json({ message: "Propiedad eliminada" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

module.exports = propertiesController
