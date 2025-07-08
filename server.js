require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const app = express();

// Configuración esencial para Railway
const PORT = process.env.PORT || 3000;

// Middlewares actualizados
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
  origin: [
    'https://snacktastico-production.up.railway.app',
    'http://localhost:3000'
  ],
  methods: ['POST', 'GET']
}));
app.use(express.json());

// Inicializa Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta WhatsApp mejorada
app.post('/enviar-whatsapp', async (req, res) => {
  console.log('Recibiendo solicitud:', req.body); // Log para diagnóstico
  
  try {
    const { name, phone, guests, date, time, message } = req.body;
    
    // Validación básica
    if (!phone || !name) {
      return res.status(400).json({ error: "Teléfono y nombre son requeridos" });
    }

    const whatsappBody = `
      *Nueva reservación* 🎉
      ▸ 👤 *Nombre:* ${name}
      ▸ 📱 *Teléfono:* ${phone}
      ▸ 🧑‍🤝‍🧑 *Personas:* ${guests}
      ▸ 🗓️ *Fecha:* ${date}
      ▸ ⏰ *Hora:* ${time}
      ${message ? `▸ 📝 *Mensaje adicional:* ${message}` : ''}
    `;

    const response = await client.messages.create({
      body: whatsappBody,
      from: 'whatsapp:+14155238886', // Número sandbox de Twilio
      to: `whatsapp:${phone.startsWith('+') ? phone : `+52${phone}`}`
    });

    console.log('Mensaje enviado:', response.sid);
    res.json({ success: true, sid: response.sid });
    
  } catch (error) {
    console.error("Error completo en Twilio:", error);
    res.status(500).json({ 
      error: "Error al enviar mensaje",
      detalle: error.message,
      codigo: error.code
    });
  }
});

app.listen(PORT, () => console.log(`Servidor listo en puerto ${PORT}`));