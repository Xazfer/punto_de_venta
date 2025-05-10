// Elaborado por: Fernando.
// Importamos las librerías que vamos a usar
const express = require("express");        // Framework para crear el servidor y manejar rutas
const session = require("express-session"); // Permite manejar sesiones de usuario (para login)
const bodyParser = require("body-parser");  // Permite procesar formularios (req.body)
const path = require("path");               // Ayuda a manejar rutas de carpetas y archivos
require("dotenv").config();                 // Permite cargar variables de entorno desde un archivo .env

// Conexión a la base de datos (la que configuramos en models/db.js)
const db = require("./models/db");

// Importamos las rutas (cada una maneja una parte del sistema)
const authRoutes = require("./routes/authRoutes");       // Rutas para login y logout
const inventarioRoutes = require('./routes/inventarioRoutes'); // Rutas para inventario
const ventasRoutes = require('./routes/ventasRoutes');         // Rutas para ventas
const comprasRoutes = require('./routes/comprasRoutes');       // Rutas para compras
const cortesRoutes = require('./routes/cortesRoutes');         // Rutas para cortes de caja

// Creamos la aplicación express
const app = express();

// Configuramos que las vistas sean EJS (plantillas dinámicas HTML)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Carpeta donde están las vistas

// Middleware para procesar formularios (antes de las rutas)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuramos las sesiones (para mantener login)
app.use(session({
  secret: "puntodeventasecreto", // Clave secreta para firmar la sesión (idealmente se pone en .env)
  resave: false,
  saveUninitialized: true,
}));

// Configuramos la carpeta public (para CSS, JS, imágenes accesibles desde el navegador)
app.use(express.static(path.join(__dirname, "public")));

// Middleware global para que las vistas puedan usar "usuario" sin pasarlo manualmente
app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario; // En cada vista estará disponible "usuario"
  next();
});

// Declaramos las rutas del sistema (cada módulo tiene sus propias rutas)
app.use("/", authRoutes);       // Login/logout
app.use("/", inventarioRoutes); // Inventario
app.use("/", ventasRoutes);     // Ventas
app.use("/", comprasRoutes);    // Compras
app.use("/", cortesRoutes);     // Cortes

// Redireccionamos la raíz (/) al login
app.get("/", (req, res) => {
  res.redirect("/login");
});

// Middleware para manejar páginas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).send("Página no encontrada");
});

// Middleware para manejar errores del servidor (500)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal en el servidor");
});

// Iniciamos el servidor en el puerto 3000 (o el que esté definido en .env)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Servidor corriendo en http://localhost:' + PORT);
});