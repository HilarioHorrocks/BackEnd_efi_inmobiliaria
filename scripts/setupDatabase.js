const mysql = require('mysql2/promise')
require('dotenv').config()

async function setupDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando a MySQL...')
    
    // Conectar sin especificar base de datos
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    })
    
    console.log('Conectado a MySQL')
      // Crear la base de datos si no existe
    const dbName = process.env.DB_NAME || 'inmobiliaria'
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`)
    console.log(`Base de datos '${dbName}' creada o ya existe`)
    
    // Usar la base de datos
    await connection.query(`USE \`${dbName}\``)
    console.log(`Usando base de datos '${dbName}'`)
    
    console.log('Base de datos configurada correctamente')
    console.log('\nInformación de conexión:')
    console.log(`   - Host: ${process.env.DB_HOST || 'localhost'}`)
    console.log(`   - Puerto: ${process.env.DB_PORT || 3306}`)
    console.log(`   - Usuario: ${process.env.DB_USER || 'root'}`)
    console.log(`   - Base de datos: ${dbName}`)
    
  } catch (error) {
    console.error('Error configurando la base de datos:')
    
    if (error.code === 'ECONNREFUSED') {
      console.error('   - MySQL no está ejecutándose. Por favor, inicia MySQL Server.')
      console.error('   - Si usas XAMPP: Inicia XAMPP y arranca MySQL')
      console.error('   - Si usas MySQL directamente: Ejecuta "net start mysql" como administrador')
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   - Credenciales incorrectas. Verifica DB_USER y DB_PASSWORD en .env')
    } else {
      console.error('   -', error.message)
    }
    
    process.exit(1)
  } finally {
    if (connection) {
      await connection.end()
    }
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupDatabase()
}

module.exports = setupDatabase
