require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');

const app = express();

// Habilita compresión gzip para todas las respuestas
app.use(compression());

// Configuración de middlewares básicos
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos DESPUÉS de configurar EJS
app.use(express.static(path.join(__dirname, 'public')));

// Servir archivos de datos
app.use('/data', express.static(path.join(__dirname, 'data')));

// Configuración de Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  message: 'Has excedido el límite de peticiones',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
    return ip.replace(/:\d+$/, '');
  }
});

// Middlewares de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com",
        "'unsafe-inline'"
      ],
      scriptSrcElem: [
        "'self'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com"
      ],
      frameSrc: ["'self'", "https://maps.google.com"],
      imgSrc: ["'self'", "data:", "https://*"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'", process.env.TWILIO_API_URL || "https://api.twilio.com"]
    }
  }
}));

app.get('/', (req, res) => {
  const cargarSnow = esFechaEspecial();
  console.log(`Cargando página. Snow activo: ${cargarSnow}`);
  
  res.render('index', { 
    cargarSnow: cargarSnow,
    fechaActual: new Date().toISOString()
  });
});

app.post('/enviar-whatsapp', apiLimiter, async (req, res) => {
  try {
    const { name, phone, guests, date, time, message } = req.body;
    
    if (!name || !phone || !guests || !date || !time) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const whatsappBody = `
      *Nueva reservación* 🎉
      ▸ 👤 *Nombre:* ${name}
      ▸ 📱 *Teléfono:* ${phone}
      ▸ 🧑‍🤝‍🧑 *Personas:* ${guests}
      ▸ 🗓️ *Fecha:* ${date}
      ▸ ⏰ *Hora:* ${time}
      ${message ? `▸ 📝 *Mensaje:* ${message}` : ''}
    `;

    const response = await client.messages.create({
      body: whatsappBody,
      from: process.env.TWILIO_WHATSAPP_FROM,
      to: process.env.TWILIO_WHATSAPP_TO
    });

    res.json({ 
      success: true, 
      sid: response.sid,
      message: 'Mensaje enviado correctamente'
    });
  } catch (error) {
    console.error("Error Twilio:", error);
    res.status(500).json({ 
      error: "Error al enviar el mensaje. Detalle: " + error.message 
    });
  }
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});