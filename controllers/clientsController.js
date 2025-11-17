const { Client, User } = require("../models")

const clientsController = {
  // GET /clients
  getAll: async (req, res) => {
    try {
      const clients = await Client.findAll({
        include: [{ model: User, as: "usuario", attributes: ["id", "nombre", "correo"] }],
      })
      res.json(clients)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // POST /clients
  create: async (req, res) => {
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
  },

  // PUT /clients/:id
  update: async (req, res) => {
    try {
      const client = await Client.findByPk(req.params.id)
      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado" })
      }

      await client.update(req.body)
      res.json(client)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // DELETE /clients/:id
  delete: async (req, res) => {
    try {
      const client = await Client.findByPk(req.params.id)
      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado" })
      }

      await client.destroy()
      res.json({ message: "Cliente eliminado" })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // GET /clients/profile/:id_usuario
  getProfile: async (req, res) => {
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
  },

  // PUT /clients/profile/:id_usuario
  updateProfile: async (req, res) => {
    try {
      const client = await Client.findOne({
        where: { id_usuario: req.params.id_usuario }
      })

      if (!client) {
        return res.status(404).json({ error: "Cliente no encontrado" })
      }

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
  },
}

module.exports = clientsController
