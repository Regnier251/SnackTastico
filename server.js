require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');

const app = express();

// Middlewares esenciales (orden importante)
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Rutas obligatorias para Railway
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta de WhatsApp
app.post('/enviar-whatsapp', async (req, res) => {
  try {
    const { name, phone, guests, date, time, message } = req.body;
    const whatsappBody = `
      *Nueva reservación* 🎉
      Nombre: ${name}
      Teléfono: ${phone}
      Personas: ${guests}
      Fecha: ${date}
      Hora: ${time}
      Mensaje: ${message}
    `;

    const response = await client.messages.create({
      body: whatsappBody,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5214731248333'
    });

    res.json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("Error Twilio:", error);
    res.status(500).json({ 
      error: "Usa una plantilla preaprobada. Detalle: " + error.message 
    });
  }
});

// Configuración final del servidor (¡Modificación clave aquí!)
const PORT = process.env.PORT || 8080; // Usa el puerto de Railway o 8080 localmente

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor funcionando en http://0.0.0.0:${PORT}`);
});

// Manejo de errores adicional
process.on('unhandledRejection', (err) => {
  console.error('Error no manejado:', err);
});