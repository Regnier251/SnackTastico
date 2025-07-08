require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares clave 
app.use(express.static(path.join(__dirname, 'public'))); // Servir archivos estáticos
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Ruta PRINCIPAL ÚNICA (elige solo una versión)
app.get('/', (req, res) => {
  // Opción 1: Si tienes un index.html en /public
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
  
  // O Opción 2: Si quieres un mensaje simple
  // res.send('¡Bienvenido a SnackTastico!');
});

// Ruta para WhatsApp
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

// Puerto - Versión mejorada
const PORT = process.env.PORT || 3000; // <-- 3000 es fallback para desarrollo local
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor listo en http://0.0.0.0:${PORT}`);
});