const bcrypt = require('bcryptjs');
const sequelize = require('./config/database');
const User = require('./models/User');
const Client = require('./models/Client');
const Property = require('./models/Property');
const Sale = require('./models/Sale');
const Rental = require('./models/Rental');

async function seedDatabase() {
  try {
    console.log('🔄 Conectando a MySQL...');
    
    // Probar conexión
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida');
    
    // Sincronizar modelos (crear tablas)
    await sequelize.sync({ force: true });
    console.log('📊 Base de datos sincronizada y tablas creadas');

    // Crear usuarios de muestra
    const adminPassword = await bcrypt.hash('admin123', 10);
    const agentPassword = await bcrypt.hash('agent123', 10);
    const clientPassword = await bcrypt.hash('cliente123', 10);

    const admin = await User.create({
      nombre: 'Administrador',
      correo: 'admin@inmobiliaria.com',
      contraseña: adminPassword,
      rol: 'admin'
    });

    const agent = await User.create({
      nombre: 'Juan Pérez',
      correo: 'juan.perez@inmobiliaria.com',
      contraseña: agentPassword,
      rol: 'agente'
    });

    // Crear usuarios clientes
    const clientUser1 = await User.create({
      nombre: 'María García',
      correo: 'maria.garcia@email.com',
      contraseña: clientPassword,
      rol: 'cliente'
    });

    const clientUser2 = await User.create({
      nombre: 'Carlos Rodríguez',
      correo: 'carlos.rodriguez@email.com',
      contraseña: clientPassword,
      rol: 'cliente'
    });

    const clientUser3 = await User.create({
      nombre: 'Ana López',
      correo: 'ana.lopez@email.com',
      contraseña: clientPassword,
      rol: 'cliente'
    });

    console.log('👥 Usuarios creados');    // Crear clientes de muestra (datos adicionales)
    const clients = await Client.bulkCreate([
      {
        documento_identidad: '12345678',
        telefono: '+54 11 1234-5678',
        direccion: 'Av. Rivadavia 1234, CABA',
        fecha_nacimiento: '1985-03-15',
        profesion: 'Ingeniera de Software',
        estado_civil: 'soltera',
        ingresos_mensuales: 150000,
        preferencias: {
          tipo_propiedad: ['apartamento', 'loft'],
          zona: ['Palermo', 'Puerto Madero'],
          presupuesto_max: 300000
        },
        id_usuario: clientUser1.id
      },
      {
        documento_identidad: '23456789',
        telefono: '+54 11 2345-6789',
        direccion: 'Calle Corrientes 5678, CABA',
        fecha_nacimiento: '1978-07-22',
        profesion: 'Contador Público',
        estado_civil: 'casado',
        ingresos_mensuales: 200000,
        preferencias: {
          tipo_propiedad: ['casa'],
          zona: ['San Isidro', 'Tigre'],
          presupuesto_max: 500000
        },
        id_usuario: clientUser2.id
      },
      {
        documento_identidad: '34567890',
        telefono: '+54 11 3456-7890',
        direccion: 'Av. Santa Fe 9012, CABA',
        fecha_nacimiento: '1990-11-08',
        profesion: 'Doctora',
        estado_civil: 'divorciada',
        ingresos_mensuales: 180000,
        preferencias: {
          tipo_propiedad: ['apartamento'],
          zona: ['Belgrano', 'Palermo'],
          presupuesto_max: 350000
        },
        id_usuario: clientUser3.id
      }
    ]);

    console.log('🧑‍💼 Clientes creados');    // Crear propiedades de muestra
    const properties = await Property.bulkCreate([      {
        direccion: 'Av. Santa Fe 3200, Palermo, CABA',
        tipo: 'apartamento',
        precio: 280000,
        estado: 'disponible',
        descripcion: 'Moderno departamento de 2 ambientes con balcón al frente, cocina integrada con isla, pisos de porcelanato y mucha luz natural. Edificio con portero 24hs y amenities.',
        tamano: 45,
        habitaciones: 2,
        banos: 1,
        garajes: 0,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1425',
        imagenes: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
          'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800'
        ],
        caracteristicas: ['Balcón', 'Portero 24hs', 'Amenities', 'Cocina integrada'],
        id_agente: agent.id
      },      {
        direccion: 'Av. Libertador 8500, San Isidro, Buenos Aires',
        tipo: 'casa',
        precio: 450000,
        estado: 'disponible',
        descripcion: 'Casa familiar de 3 dormitorios con jardín, garage para 2 autos y parrilla. Zona residencial muy tranquila.',
        tamano: 120,
        habitaciones: 3,
        banos: 2,
        garajes: 2,
        ciudad: 'San Isidro',
        codigo_postal: 'B1642',
        imagenes: [
          'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800',
          'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800'
        ],
        caracteristicas: ['Jardín', 'Parrilla', 'Garage doble', 'Zona residencial'],
        id_agente: agent.id
      },
      {
        direccion: 'Av. Alicia Moreau de Justo 1500, Puerto Madero, CABA',
        tipo: 'loft',
        precio: 520000,
        estado: 'disponible',
        descripcion: 'Espectacular loft de diseño industrial con vista panorámica al río, doble altura, cocina de alta gama, baño suite y espacios amplios. Edificio premium con amenities completos.',
        tamano: 65,
        habitaciones: 1,
        banos: 1,
        garajes: 1,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1107',
        imagenes: [
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
          'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'
        ],
        caracteristicas: ['Vista al río', 'Doble altura', 'Diseño industrial', 'Amenities premium'],
        id_agente: agent.id
      },
      {
        direccion: 'Av. Cabildo 2800, Belgrano, CABA',
        tipo: 'apartamento',
        precio: 180000,
        estado: 'vendida',
        descripcion: 'Monoambiente ideal para estudiantes o profesionales jóvenes. Cerca del subte y universidades.',
        tamano: 32,
        habitaciones: 1,
        banos: 1,
        garajes: 0,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1428',
        imagenes: [
          'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'
        ],
        caracteristicas: ['Cerca del subte', 'Ideal estudiantes', 'Monoambiente'],
        id_agente: agent.id
      },
      {
        direccion: 'Arroyo Gambado 1200, Tigre, Buenos Aires',
        tipo: 'casa',
        precio: 380000,
        estado: 'alquilada',
        descripcion: 'Casa quinta con muelle privado, amplio parque y pileta. Perfecta para escapadas de fin de semana.',
        tamano: 200,
        habitaciones: 4,
        banos: 3,
        garajes: 2,
        ciudad: 'Tigre',
        codigo_postal: 'B1648',
        imagenes: [
          'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
          'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800'
        ],
        caracteristicas: ['Muelle privado', 'Pileta', 'Parque amplio', 'Casa quinta'],
        id_agente: agent.id
      },
      {
        direccion: 'Av. Corrientes 1500, Palermo, CABA',
        tipo: 'apartamento',
        precio: 320000,
        estado: 'disponible',
        descripcion: 'Departamento de 3 ambientes con balcón francés, muy luminoso y cerca del transporte público.',
        tamano: 60,
        habitaciones: 2,
        banos: 1,
        garajes: 0,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1414',
        imagenes: [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'
        ],
        caracteristicas: ['Balcón francés', 'Muy luminoso', 'Transporte público'],
        id_agente: agent.id
      },
      {
        direccion: 'Calle Florida 800, Puerto Madero, CABA',
        tipo: 'loft',
        precio: 680000,
        estado: 'disponible',
        descripcion: 'Loft premium de lujo con vista 360° al río y la ciudad, techos de 4 metros, ventanales de piso a techo, cocina gourmet y terraza privada. Edificio icónico con spa y gimnasio.',
        tamano: 85,
        habitaciones: 1,
        banos: 2,
        garajes: 1,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1107',
        imagenes: [
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
          'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800'
        ],
        caracteristicas: ['Vista 360°', 'Terraza privada', 'Cocina gourmet', 'Spa y gimnasio'],
        id_agente: agent.id
      },      {
        direccion: 'Av. del Libertador 2200, Belgrano, CABA',
        tipo: 'casa',
        precio: 550000,
        estado: 'disponible',
        descripcion: 'Casa tipo chalet con jardín amplio, 4 dormitorios y pileta. Ideal para familias.',
        tamano: 150,
        habitaciones: 4,
        banos: 3,
        garajes: 2,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1428',
        imagenes: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
          'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800'
        ],
        caracteristicas: ['Jardín amplio', 'Pileta', 'Tipo chalet', 'Ideal familias'],
        id_agente: agent.id
      },
      {
        direccion: 'Pacheco de Melo 1800, Palermo, CABA',
        tipo: 'apartamento',
        precio: 220000,
        estado: 'disponible',
        descripcion: 'Departamento de 1 ambiente con terraza propia, cocina integrada y laundry.',
        tamano: 38,
        habitaciones: 1,
        banos: 1,
        garajes: 0,
        ciudad: 'Buenos Aires',
        codigo_postal: 'C1414',
        imagenes: [
          'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'
        ],
        caracteristicas: ['Terraza propia', 'Cocina integrada', 'Laundry'],
        id_agente: agent.id
      },
      {
        direccion: 'Av. Maipú 1000, San Isidro, Buenos Aires',
        tipo: 'casa',
        precio: 420000,
        estado: 'disponible',
        descripcion: 'Casa moderna de 2 plantas con garage doble, quincho y parrilla. Excelente ubicación.',
        tamano: 110,
        habitaciones: 3,
        banos: 2,
        garajes: 2,
        ciudad: 'San Isidro',
        codigo_postal: 'B1642',
        imagenes: [
          'https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800',
          'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800'
        ],
        caracteristicas: ['2 plantas', 'Quincho', 'Parrilla', 'Garage doble'],
        id_agente: agent.id
      }
    ]);

    console.log('🏠 Propiedades creadas');    // Crear ventas de muestra
    const sales = await Sale.bulkCreate([
      {
        id_propiedad: properties[3].id,
        id_cliente: clients[0].id,
        fecha_venta: new Date('2024-10-15'),
        monto_total: 180000,
        monto_comision: 9000,
        porcentaje_comision: 5.00,
        estado: 'finalizada',
        forma_pago: 'credito',
        numero_escritura: 'ESC-2024-001',
        observaciones: 'Venta realizada sin inconvenientes. Cliente muy satisfecho.'
      },
      {
        id_propiedad: properties[1].id,
        id_cliente: clients[1].id,
        fecha_venta: new Date('2024-11-01'),
        monto_total: 445000,
        monto_comision: 22250,
        porcentaje_comision: 5.00,
        estado: 'finalizada',
        forma_pago: 'mixto',
        numero_escritura: 'ESC-2024-002',
        observaciones: 'Pago 50% contado, 50% crédito hipotecario.'
      }
    ]);

    console.log('💰 Ventas creadas');    // Crear alquileres de muestra
    const rentals = await Rental.bulkCreate([
      {
        id_propiedad: properties[4].id,
        id_cliente: clients[2].id,
        fecha_inicio: '2024-09-01',
        fecha_fin: '2025-09-01',
        monto_mensual: 3500,
        monto_deposito: 7000,
        monto_administracion: 350,
        estado: 'activo',
        numero_contrato: 'ALQ-2024-001',
        renovacion_automatica: true,
        servicios_incluidos: ['Internet', 'Cable TV', 'Seguridad 24hs'],
        observaciones: 'Contrato anual con opción a renovación automática.'
      },
      {
        id_propiedad: properties[0].id,
        id_cliente: clients[1].id,
        fecha_inicio: '2024-11-01',
        fecha_fin: '2025-11-01',
        monto_mensual: 2800,
        monto_deposito: 5600,
        monto_administracion: 280,
        estado: 'activo',
        numero_contrato: 'ALQ-2024-002',
        renovacion_automatica: false,
        servicios_incluidos: ['Portero 24hs', 'Amenities'],
        observaciones: 'Cliente nuevo, referencias verificadas.'
      }
    ]);

    console.log('🏡 Alquileres creados');

    console.log('\n✅ Base de datos poblada con datos de muestra exitosamente!');
    console.log('\n📋 Datos creados:');
    console.log(`👥 ${clients.length} clientes`);
    console.log(`🏠 ${properties.length} propiedades`);
    console.log(`💰 ${sales.length} ventas`);
    console.log(`🏡 ${rentals.length} alquileres`);
    console.log('\n🔑 Usuarios de prueba:');
    console.log('Admin: admin@inmobiliaria.com / admin123');
    console.log('Agente: juan.perez@inmobiliaria.com / agent123');
    console.log('Cliente: maria.garcia@email.com / cliente123');

  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error);
  } finally {
    await sequelize.close();
  }
}

// Ejecutar el script
seedDatabase();
