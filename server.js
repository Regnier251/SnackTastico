require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const app = express();

// Configuración de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*'
}));

// Limitar peticiones a 100 por hora por IP
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 100
});
app.use(limiter);

// Middlewares
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Cliente Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Validación de datos
const validateReservation = (data) => {
  const { name, phone, guests, date, time } = data;
  if (!name || !phone || !guests || !date || !time) {
    throw new Error('Faltan campos requeridos');
  }
  if (!/^\d{10,15}$/.test(phone)) {
    throw new Error('Teléfono inválido');
  }
};

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Nueva ruta para procesar reservas (recomendada)
app.post('/api/reservations', async (req, res) => {
  try {
    const { name, phone, guests, date, time, message, email } = req.body;
    
    // Validación
    validateReservation(req.body);
    
    // Formatear mensaje para WhatsApp
    const whatsappBody = `
      *Nueva reservación* 🎉
      ▸ 👤 *Nombre:* ${name}
      ${email ? `▸ 📧 *Email:* ${email}\n` : ''}
      ▸ 📱 *Teléfono:* ${phone}
      ▸ 🧑‍🤝‍🧑 *Personas:* ${guests}
      ▸ 🗓️ *Fecha:* ${date}
      ▸ ⏰ *Hora:* ${time}
      ${message ? `▸ ✉️ *Mensaje:* ${message}` : ''}
    `;

    // Enviar a WhatsApp
    const response = await client.messages.create({
      body: whatsappBody,
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${process.env.DESTINATION_PHONE}`
    });

    // Registrar en base de datos (opcional)
    // await saveToDatabase(req.body);

    res.json({ 
      success: true, 
      sid: response.sid,
      message: 'Reservación enviada correctamente'
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(400).json({ 
      success: false,
      error: error.message || 'Error al procesar la reservación'
    });
  }
});

// ruta para whatapp
app.post('/enviar-whatsapp', async (req, res) => {
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor en puerto ${PORT}`);
});