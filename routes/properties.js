const express = require("express")
const propertiesController = require("../controllers/propertiesController")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

router.get("/", propertiesController.getAll)
router.post("/", auth, checkRole("admin", "agente"), propertiesController.create)
router.put("/:id", auth, checkRole("admin", "agente"), propertiesController.update)
router.delete("/:id", auth, checkRole("admin"), propertiesController.delete)

module.exports = router
