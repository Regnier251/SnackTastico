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

// Configuración avanzada de caché y optimización para archivos estáticos
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: '7d',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Cache-Control específico según tipo de archivo
    if (path.endsWith('.css') || path.endsWith('.js')) {
      res.setHeader('Cache-Control', 'public, max-age=604800'); // 1 semana
    } else if (path.endsWith('.webp') || path.endsWith('.jpg') || path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'public, max-age=2592000'); // 30 días
    } else if (path.endsWith('.woff2') || path.endsWith('.woff')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // 1 año
    }
    
    // Habilitar CORS para recursos estáticos
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Optimización de compresión
    res.setHeader('Vary', 'Accept-Encoding');
  }
}));

// Configuración de Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const apiLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 horas (más flexible)
  max: 20, // Permite más peticiones
  message: 'Has excedido el límite de peticiones',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Manejo correcto para IPv4/IPv6 y proxies
    const forwarded = req.headers['x-forwarded-for'];
    const ip = forwarded ? forwarded.split(',')[0] : req.socket.remoteAddress;
    return ip.replace(/:\d+$/, ''); // Elimina puerto si existe
  }
});

// Middlewares y antes de las rutas
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://unpkg.com"
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

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
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

// Iniciar servidor
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});