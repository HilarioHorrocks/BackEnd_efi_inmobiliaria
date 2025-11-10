const User = require("./User")
const Property = require("./Property")
const Client = require("./Client")
const Rental = require("./Rental")
const Sale = require("./Sale")

// Relaciones
Property.belongsTo(User, { foreignKey: "id_agente", as: "agente" })
User.hasMany(Property, { foreignKey: "id_agente", as: "propiedades" })

Client.belongsTo(User, { foreignKey: "id_usuario", as: "usuario" })
User.hasOne(Client, { foreignKey: "id_usuario", as: "datosCliente" })

Rental.belongsTo(Property, { foreignKey: "id_propiedad", as: "propiedad" })
Rental.belongsTo(Client, { foreignKey: "id_cliente", as: "cliente" })
Property.hasMany(Rental, { foreignKey: "id_propiedad", as: "alquileres" })
Client.hasMany(Rental, { foreignKey: "id_cliente", as: "alquileres" })

Sale.belongsTo(Property, { foreignKey: "id_propiedad", as: "propiedad" })
Sale.belongsTo(Client, { foreignKey: "id_cliente", as: "cliente" })
Property.hasMany(Sale, { foreignKey: "id_propiedad", as: "ventas" })
Client.hasMany(Sale, { foreignKey: "id_cliente", as: "ventas" })

module.exports = { User, Property, Client, Rental, Sale }
