# 📲 Proyecto Twilio - Enviar Reservaciones por WhatsApp

Este proyecto permite recibir reservas de eventos a través de un formulario web y enviarlas a un número de WhatsApp utilizando la API de Twilio. Es ideal para restaurantes, eventos o negocios que gestionen reservas y quieran recibirlas por WhatsApp de forma automatizada.

---

## 🚀 Características

- **Formulario de reservación**: Recoge nombre, teléfono, número de personas, fecha, hora y mensaje opcional.
- **Twilio API**: Utiliza Twilio para enviar automáticamente la reservación a WhatsApp.
- **Seguridad y optimización**: 
  - CORS habilitado
  - Helmet para protección de cabeceras HTTP
  - Limitación de solicitudes por IP
- **Validación de datos**: Requiere campos obligatorios antes de enviar el mensaje.

---

## ⚙️ Requisitos

- Node.js (versión 14.x o superior)
- Cuenta de Twilio (Account SID y Auth Token)
- Número de Twilio habilitado para WhatsApp

---

## ⚙️ Dependencias
- express: Framework para servidor web.
- twilio: Cliente oficial para Twilio.
- cors: Middleware para habilitar CORS.
- helmet: Seguridad HTTP.
- express-rate-limit: Limitador de peticiones.
- dotenv: Carga variables de entorno.

---

## 📦 Instalación

1. **Clona el repositorio**

```bash
git clone <URL_DEL_REPOSITORIO>
cd reservas-whatsapp
Instala las dependencias
```

Asegúrate de tener Node.js instalado:

```bash
npm install
Configura las variables de entorno
```

Crea un archivo .env en la raíz del proyecto con el siguiente contenido:

```env
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_WHATSAPP_FROM=whatsapp:+1415XXXXXXX  # Número de Twilio habilitado para WhatsApp
TWILIO_WHATSAPP_TO=whatsapp:+5244XXXXXXX    # Número de destino para recibir la reserva
PORT=8080                                    # (Opcional) Puerto del servidor
```

---

## 🏃‍♂️ Ejecución
Inicia el servidor con el siguiente comando:

```bash
Copy code
npm start
```

El servidor se ejecutará por defecto en:
👉 http://localhost:8080

Puedes cambiar el puerto desde el archivo .env.

---

## 🌐 Uso
Accede al formulario en: http://localhost:8080/

Completa los datos de la reservación.

Al enviar el formulario, los datos se enviarán como un mensaje de WhatsApp usando la API de Twilio al número configurado.

---

## 🚫 Limitación de solicitudes
El servidor permite un máximo de 10 solicitudes cada 48 horas por IP para evitar abuso de la API.
Si excedes el límite, recibirás el siguiente mensaje de error:

nginx
Copy code
Has excedido el límite de peticiones.

---

## 🛠️ Middleware y Seguridad
CORS: Control de acceso desde dominios específicos.

Rate Limiting: Límite de 10 solicitudes cada 48 horas por IP.

Helmet: Protección contra vulnerabilidades HTTP comunes.

dotenv: Manejo seguro de variables de entorno.

---

## 🐛 Manejo de errores
Si ocurre un error al enviar el mensaje por Twilio, se mostrará un mensaje de error detallado.

Si los datos enviados están incompletos o mal formateados, también se notificará con un mensaje adecuado.

---

## 🔒 Seguridad
⚠️ IMPORTANTE: No subas tu archivo .env al repositorio.
Este archivo contiene credenciales sensibles como tus claves de Twilio.

Agrega .env a tu archivo .gitignore:

```bash
Copy code
echo .env >> .gitignore
```

---

## 📸 Captura de pantalla
(Aquí puedes agregar una imagen del formulario o del mensaje en WhatsApp)

---

## 📜 Licencia
Este proyecto está licenciado bajo la licencia MIT.

path: Manejo de rutas de archivos en Node.js.

¡Gracias por usar este proyecto! Si te fue útil, considera darle una ⭐ al repositorio.
