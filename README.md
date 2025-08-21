Proyecto Twilio - Enviar Reservaciones por WhatsApp
Este proyecto permite recibir reservas de eventos a través de un formulario web y enviar las reservaciones a un número de WhatsApp utilizando la API de Twilio. Es ideal para restaurantes, eventos o negocios que gestionen reservas y quieran recibirlas por WhatsApp de manera automatizada.

🚀 Características
Formulario de reservación: Recoge nombre, teléfono, número de personas, fecha, hora y mensaje opcional.

Twilio API: Utiliza Twilio para enviar la reservación a WhatsApp de forma automática.

Seguridad y optimización: Incluye medidas de seguridad básicas como CORS, helmet para protección de cabeceras HTTP, y limitación de solicitudes para evitar abusos.

Validación de datos: Requiere ciertos campos obligatorios antes de enviar el mensaje.

⚙️ Requisitos
Node.js (versiones recomendadas: 14.x o superior)

Twilio Account SID y Auth Token: Necesarios para autenticar la API de Twilio.

Twilio WhatsApp Numbers: Un número de Twilio habilitado para enviar y recibir mensajes por WhatsApp.


📦 Instalación
Clona el repositorio:

bash
Copiar
Editar
git clone <URL_DEL_REPOSITORIO>
cd reservas-whatsapp
Instala las dependencias:

Asegúrate de tener Node.js instalado, luego ejecuta:

bash
Copiar
Editar
npm install
Configura las variables de entorno:

Crea un archivo .env en la raíz del proyecto con las siguientes claves:

env
Copiar
Editar
TWILIO_ACCOUNT_SID=tu_account_sid_de_twilio
TWILIO_AUTH_TOKEN=tu_auth_token_de_twilio
TWILIO_WHATSAPP_FROM=whatsapp:+1415XXXXXXX  # Número de Twilio habilitado para WhatsApp
TWILIO_WHATSAPP_TO=whatsapp:+5244XXXXXXX  # Número de destino donde se recibirá la reserva
PORT=8080  # (Opcional) Puerto en el que se ejecutará el servidor
🏃‍♂️ Ejecución
Ejecuta el servidor localmente con el siguiente comando:

bash
Copiar
Editar
npm start
El servidor se iniciará en http://localhost:8080 por defecto. Si el puerto 8080 ya está en uso, puedes cambiarlo a otro puerto configurando la variable PORT en el archivo .env.

🌐 Uso
Formulario de reserva: Dirígete a http://localhost:8080/ y completa el formulario con los detalles de la reservación.

Cuando el formulario sea enviado, los datos serán enviados a través de la API de Twilio como un mensaje de WhatsApp al número configurado.

Limitación de solicitudes
El servidor está configurado para permitir un máximo de 10 solicitudes cada 48 horas desde la misma dirección IP, con el fin de evitar abusos de la API. Si excedes el límite, recibirás el siguiente mensaje de error:
Has excedido el límite de peticiones.

🛠️ Middleware y Seguridad
CORS: Habilitado para permitir solicitudes desde dominios específicos.

Rate Limiting: Limitación de solicitudes a 10 peticiones cada 48 horas para evitar el abuso de la API.

Helmet: Protección contra ataques comunes de seguridad en HTTP.

dotenv: Se utiliza para cargar las variables de entorno desde el archivo .env para proteger las credenciales y configuraciones sensibles.

🐛 Manejo de Errores
Si hay algún error en el proceso de envío del mensaje a través de Twilio, se devuelve un mensaje detallado de error. Si los datos enviados no son completos o están mal formateados, se informará con un mensaje de error.

🔒 Seguridad
Asegúrate de que tu archivo .env no esté subido a tu repositorio. Este archivo contiene información sensible como las claves de Twilio. Para evitar esto, agrega .env al archivo .gitignore.

📸 Captura de pantalla

📜 Licencia
Este proyecto está bajo la licencia MIT.

⚙️ Dependencias
express: Framework para crear aplicaciones web.

twilio: Librería para interactuar con la API de Twilio.

cors: Middleware para habilitar CORS.

path: Utilidad para manejar rutas de archivos.

rate-limit: Limita el número de solicitudes en un tiempo determinado.

helmet: Middleware para proteger cabeceras HTTP.
