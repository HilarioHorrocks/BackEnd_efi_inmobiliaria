const express = require("express")
const clientsController = require("../controllers/clientsController")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

router.get("/", auth, checkRole("admin", "agente"), clientsController.getAll)
router.post("/", auth, checkRole("admin", "agente"), clientsController.create)
router.put("/:id", auth, checkRole("admin", "agente"), clientsController.update)
router.delete("/:id", auth, checkRole("admin"), clientsController.delete)

router.get("/profile/:id_usuario", auth, clientsController.getProfile)
router.put("/profile/:id_usuario", auth, clientsController.updateProfile)

module.exports = router
