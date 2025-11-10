const express = require("express")
const cors = require("cors")
const sequelize = require("./config/database")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Rutas
app.use("/api/auth", require("./routes/auth"))
app.use("/api/properties", require("./routes/properties"))
app.use("/api/clients", require("./routes/clients"))
app.use("/api/rentals", require("./routes/rentals"))
app.use("/api/sales", require("./routes/sales"))
app.use("/api/users", require("./routes/users"))

// Inicializar base de datos
async function initializeDatabase() {
  try {
    console.log('🔄 Conectando a MySQL...')
    await sequelize.authenticate()
    console.log('✅ Conexión a MySQL establecida')
    
    await sequelize.sync({ alter: false })
    console.log('📊 Base de datos sincronizada')
  } catch (error) {
    console.error('❌ Error de base de datos:')
    
    if (error.name === 'ConnectionError') {
      console.error('   - MySQL no está ejecutándose')
      console.error('   - Asegúrate de que MySQL esté iniciado')
      console.error('   - Si usas XAMPP, inicia MySQL desde el panel de control')
    } else if (error.name === 'AccessDeniedError') {
      console.error('   - Credenciales incorrectas en .env')
      console.error('   - Verifica DB_USER y DB_PASSWORD')
    } else if (error.name === 'HostNotFoundError') {
      console.error('   - Host incorrecto en .env')
      console.error('   - Verifica DB_HOST')
    } else {
      console.error('   -', error.message)
    }
    
    console.error('\n📋 Para configurar MySQL ejecuta: npm run setup-db')
    process.exit(1)
  }
}

initializeDatabase()

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`❌ Puerto ${PORT} ya está en uso. Cerrando servidor...`)
    process.exit(1)
  } else {
    console.error('❌ Error del servidor:', err)
  }
})

// Manejar cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 Cerrando servidor...')
  server.close(() => {
    console.log('✅ Servidor cerrado')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('🛑 Cerrando servidor...')
  server.close(() => {
    console.log('✅ Servidor cerrado')
    process.exit(0)
  })
})
