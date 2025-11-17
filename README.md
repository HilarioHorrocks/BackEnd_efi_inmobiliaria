# Backend - Sistema Inmobiliario

API REST para gestión de propiedades inmobiliarias, construida con Node.js, Express y MySQL.

## 🚀 Tecnologías

- **Node.js** v18+
- **Express.js** - Framework web
- **MySQL** 8.4 - Base de datos
- **Sequelize** - ORM
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **SendGrid** - Envío de emails
- **dotenv** - Variables de entorno

## 📋 Requisitos Previos

- Node.js (v18 o superior)
- MySQL Server (v8.4 o superior)
- npm o yarn
- Cuenta de SendGrid (para recuperación de contraseña)

## 🔧 Instalación

1. **Clonar el repositorio**
```bash
cd backend
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` en la raíz del backend:

```env
# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=inmobiliaria
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_muy_segura

# SendGrid (Email)
SENDGRID_API_KEY=tu_api_key_de_sendgrid
SENDGRID_FROM_EMAIL=tu_email_verificado@dominio.com
SENDGRID_FROM_NAME=Inmobiliaria

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
```

4. **Crear la base de datos**
```sql
CREATE DATABASE inmobiliaria CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

5. **Ejecutar las migraciones**

El servidor creará automáticamente las tablas al iniciarse por primera vez.

## 🎯 Scripts Disponibles

```bash
# Desarrollo (con nodemon)
npm run dev

# Producción
npm start

# Llenar la base de datos con datos de prueba
node seedDatabase.js
```

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── database.js          # Configuración de Sequelize
├── controllers/            
│   ├── authController.js    # Autenticación y recuperación
│   ├── usersController.js   # Gestión de usuarios
│   ├── clientsController.js # Gestión de clientes y perfil
│   ├── propertiesController.js # Gestión de propiedades
│   ├── rentalsController.js # Gestión de alquileres
│   └── salesController.js   # Gestión de ventas
├── middleware/
│   └── auth.js              # Middleware de autenticación JWT
├── migrations/              
│   ├── 20250111000001-create-users.js
│   ├── 20250111000002-create-properties.js
│   ├── 20250111000003-create-clients.js
│   ├── 20250111000004-create-rentals.js
│   └── 20250111000005-create-sales.js
├── models/
│   ├── index.js             # Configuración de relaciones
│   ├── User.js              # Modelo de usuarios
│   ├── Client.js            # Modelo de clientes
│   ├── Property.js          # Modelo de propiedades
│   ├── Rental.js            # Modelo de alquileres
│   └── Sale.js              # Modelo de ventas
├── routes/                  
│   ├── auth.js              # Rutas de autenticación
│   ├── users.js             # CRUD de usuarios
│   ├── clients.js           # CRUD de clientes + perfil
│   ├── properties.js        # CRUD de propiedades
│   ├── rentals.js           # Gestión de alquileres
│   └── sales.js             # Gestión de ventas
├── scripts/
│   └── setupDatabase.js     # Script de configuración inicial
├── .env                     # Variables de entorno (no incluir en git)
├── .sequelizerc             
├── .gitignore
├── package.json
├── seedDatabase.js          # Datos de prueba
└── server.js                # Punto de entrada
```


##  Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/forgot-password` - Solicitar recuperación de contraseña
- `POST /api/auth/reset-password` - Restablecer contraseña

### Usuarios
- `GET /api/users` - Listar usuarios (admin)
- `GET /api/users/:id` - Obtener usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

### Clientes
- `GET /api/clients` - Listar clientes (admin/agente)
- `POST /api/clients` - Crear cliente (admin/agente)
- `GET /api/clients/profile/:id_usuario` - Obtener perfil del cliente
- `PUT /api/clients/profile/:id_usuario` - Actualizar perfil del cliente
- `PUT /api/clients/:id` - Actualizar cliente (admin/agente)
- `DELETE /api/clients/:id` - Eliminar cliente (admin)

### Propiedades
- `GET /api/properties` - Listar propiedades (público con filtros)
- `GET /api/properties/:id` - Obtener propiedad específica
- `POST /api/properties` - Crear propiedad (admin/agente)
- `PUT /api/properties/:id` - Actualizar propiedad (admin/agente)
- `DELETE /api/properties/:id` - Eliminar propiedad (admin)

### Alquileres
- `GET /api/rentals/:id_usuario` - Obtener alquileres del usuario
- `POST /api/rentals/rent` - Alquilar propiedad (cliente)
- `DELETE /api/rentals/:id` - Cancelar alquiler

### Ventas
- `GET /api/sales/:id_usuario` - Obtener compras del usuario
- `POST /api/sales/purchase` - Comprar propiedad (cliente)
- `DELETE /api/sales/:id` - Cancelar venta

## Roles de Usuario

- **admin**: Acceso total al sistema
- **agente**: Gestión de propiedades y clientes
- **cliente**: Visualización de propiedades, alquileres y compras

## Modelos de Base de Datos

### Users
- Usuarios del sistema con diferentes roles
- Autenticación y gestión de sesiones

### Clients
- Información extendida de clientes
- Vinculado a usuario mediante `id_usuario`

### Properties
- Propiedades inmobiliarias
- Estados: disponible, alquilada, vendida
- Disponibilidad: venta, alquiler, ambos

### Rentals
- Contratos de alquiler
- Estados: activo, finalizado, cancelado

### Sales
- Transacciones de venta
- Estados: finalizada, cancelada

## Seguridad

- Contraseñas hasheadas con bcrypt
- Tokens JWT con expiración de 24 horas
- Middleware de autenticación en rutas protegidas
- Validación de roles por endpoint
- Reset de contraseña con tokens temporales


## 📧 Configuración de SendGrid

1. Crear cuenta en [SendGrid](https://sendgrid.com/)
2. Verificar un email sender
3. Generar API Key
4. Configurar en `.env`




