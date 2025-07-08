require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/enviar-whatsapp', async (req, res) => {
  try {
    const { name, phone, guests, date, time, message } = req.body;

    const whatsappBody = `
📅 *NUEVA RESERVACIÓN CONFIRMADA* 📅
━━━━━━━━━━━━━━━━━━━━
▸ 👤 *Nombre:* ${name}
▸ 📱 *Teléfono:* ${phone}
▸ 🧑‍🤝‍🧑 *Personas:* ${guests}
▸ 🗓️ *Fecha:* ${date}
▸ ⏰ *Hora:* ${time}
━━━━━━━━━━━━━━━━━━━━
📝 *Mensaje adicional:*
${message}
━━━━━━━━━━━━━━━━━━━━
¡Gracias por preferirnos! 🎉
`;

    const response = await client.messages.create({
      body: whatsappBody,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5214731248333'
    });

    res.json({ 
      success: true, 
      sid: response.sid,
      message: "Mensaje enviado correctamente"
    });

  } catch (error) {
    console.error("Error Twilio:", error);
    res.status(500).json({ 
      success: false,
      error: "Error al procesar la solicitud",
      details: error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor activo en puerto ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('Error no controlado:', err);
});