const { User, Client } = require("../models")

const usersController = {
  // GET /users/profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ["contraseña"] },
        include: [{ model: Client, as: "datosCliente" }],
      })
      res.json(user)
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },
}

module.exports = usersController
