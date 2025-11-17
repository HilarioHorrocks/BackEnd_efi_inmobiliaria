const express = require("express")
const salesController = require("../controllers/salesController")
const { auth, checkRole } = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, salesController.create)
router.get("/:id_usuario", auth, salesController.getByUser)
router.put("/:id", auth, checkRole("admin", "agente"), salesController.update)
router.delete("/:id", auth, salesController.cancel)
router.delete("/:id/remove", auth, checkRole("admin"), salesController.remove)
router.post("/purchase", auth, salesController.purchaseProperty)

module.exports = router
