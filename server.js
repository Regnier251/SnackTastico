require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const app = express();

// Middlewares clave 
app.use(express.static(path.join(__dirname, 'public'))); // <-- Servir CSS/JS/Imágenes
app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Ruta para la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/', (req, res) => {
  res.send('¡Bienvenido a SnackTastico!');
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

const PORT = process.env.PORT || 3000; // Railway asigna un puerto dinámico
app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));