const express = require("express")
const usersController = require("../controllers/usersController")
const { auth } = require("../middleware/auth")

const router = express.Router()

router.get("/profile", auth, usersController.getProfile)

module.exports = router
