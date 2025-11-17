const express = require("express")
const rentalsController = require("../controllers/rentalsController")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, rentalsController.create)
router.get("/:id_usuario", auth, rentalsController.getByUser)
router.put("/:id", auth, checkRole("admin", "agente"), rentalsController.update)
router.delete("/:id", auth, rentalsController.cancel)
router.post("/rent", auth, rentalsController.rentProperty)

module.exports = router
