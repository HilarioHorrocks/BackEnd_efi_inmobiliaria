const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const sgMail = require("@sendgrid/mail")
const { User } = require("../models")

// Configuracion SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const authController = {
  // POST /auth/register
  register: async (req, res) => {
    try {
      const { nombre, correo, contraseña, rol } = req.body

      const userExists = await User.findOne({ where: { correo } })
      if (userExists) {
        return res.status(400).json({ error: "Usuario ya existe" })
      }

      const hashedPassword = await bcrypt.hash(contraseña, 10)
      const user = await User.create({
        nombre,
        correo,
        contraseña: hashedPassword,
        rol: rol || "cliente",
      })

      res.status(201).json({
        message: "Usuario creado exitosamente",
        user: { 
          id: user.id, 
          nombre: user.nombre, 
          correo: user.correo, 
          rol: user.rol 
        },
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // POST /auth/login
  login: async (req, res) => {
    try {
      const { correo, contraseña } = req.body
      const user = await User.findOne({ where: { correo } })

      if (!user) {
        return res.status(400).json({ error: "Usuario no encontrado" })
      }

      const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña)
      if (!isPasswordValid) {
        return res.status(400).json({ error: "Contraseña incorrecta" })
      }

      const token = jwt.sign(
        { id: user.id, correo: user.correo, rol: user.rol },
        process.env.JWT_SECRET || "secret_key",
        { expiresIn: "24h" }
      )

      res.json({ 
        token, 
        user: { 
          id: user.id, 
          nombre: user.nombre, 
          correo: user.correo, 
          rol: user.rol 
        } 
      })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  },

  // POST /auth/forgot-password
  forgotPassword: async (req, res) => {
    try {
      const { correo } = req.body

      if (!correo) {
        return res.status(400).json({ error: "El correo es requerido" })
      }

      const user = await User.findOne({ where: { correo } })
      if (!user) {
        console.log("❌ Usuario no encontrado:", correo)
        return res.json({ 
          message: "Si el correo existe, recibirás un email con instrucciones para restablecer tu contraseña" 
        })
      }
      
      console.log("✅ Usuario encontrado:", user.nombre, user.correo)

      const resetToken = crypto.randomBytes(32).toString("hex")
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hora

      await user.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      })
      
      console.log("Token generado y guardado en BD")

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
      console.log("Enlace de recuperación:", resetUrl)

      const msg = {
        to: user.correo,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL,
          name: process.env.SENDGRID_FROM_NAME,
        },
        subject: "Recuperación de Contraseña - EFI Inmobiliaria",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background-color: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
              .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 12px; margin-top: 20px; }
              .warning { color: #dc2626; font-weight: bold; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Recuperación de Contraseña</h1>
              </div>
              <div class="content">
                <p>Hola <strong>${user.nombre}</strong>,</p>
                <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>EFI Inmobiliaria</strong>.</p>
                <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
                </div>
                <p>O copia y pega este enlace en tu navegador:</p>
                <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px; font-size: 12px;">
                  ${resetUrl}
                </p>
                <p class="warning">Este enlace expirará en 1 hora por motivos de seguridad.</p>
                <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} EFI Inmobiliaria. Todos los derechos reservados.</p>
                <p>Este es un correo automático, por favor no respondas.</p>
              </div>
            </div>
          </body>
          </html>
        `,
        text: `
          Hola ${user.nombre},
          
          Recibimos una solicitud para restablecer la contraseña de tu cuenta en EFI Inmobiliaria.
          
          Visita el siguiente enlace para crear una nueva contraseña:
          ${resetUrl}
          
          Este enlace expirará en 1 hora por motivos de seguridad.
          
          Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
          
          © ${new Date().getFullYear()} EFI Inmobiliaria
        `,
      }

      console.log("Intentando enviar email a:", user.correo)
      
      try {
        const result = await sgMail.send(msg)
        console.log("Email enviado exitosamente:", result[0].statusCode)
      } catch (sendError) {
        console.error("Error al enviar email:", sendError.message)
      }

      res.json({ 
        message: "Si el correo existe, recibirás un email con instrucciones para restablecer tu contraseña" 
      })
    } catch (error) {
      console.error("Error en forgot-password:", error)
      res.status(500).json({ error: "Error al procesar la solicitud de recuperación de contraseña" })
    }
  },

  // POST /auth/reset-password
  resetPassword: async (req, res) => {
    try {
      const { token, nuevaContraseña } = req.body

      if (!token || !nuevaContraseña) {
        return res.status(400).json({ error: "Token y nueva contraseña son requeridos" })
      }

      if (nuevaContraseña.length < 6) {
        return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres" })
      }

      const user = await User.findOne({
        where: { reset_token: token },
      })

      if (!user) {
        return res.status(400).json({ error: "Token inválido o expirado" })
      }

      if (user.reset_token_expiry < new Date()) {
        return res.status(400).json({ error: "Token inválido o expirado" })
      }

      const hashedPassword = await bcrypt.hash(nuevaContraseña, 10)

      await user.update({
        contraseña: hashedPassword,
        reset_token: null,
        reset_token_expiry: null,
      })

      res.json({ message: "Contraseña restablecida exitosamente" })
    } catch (error) {
      console.error("Error en reset-password:", error)
      res.status(500).json({ error: "Error al restablecer la contraseña" })
    }
  },
}

module.exports = authController
