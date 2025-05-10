// routes/comprasRoutes.js
// Este archivo define las "rutas" relacionadas con el proceso de compras en el sistema

const express = require('express'); // Se utiliza para gestionar las peticiones del navegador
const router = express.Router(); // Crea un conjunto de rutas para compras
const comprasController = require('../controllers/comprasController'); // Aquí se encuentra la lógica de las compras

// Esta ruta se encarga de mostrar la página donde se registran las compras
// Cuando el usuario visita "/compras", se le muestra la pantalla correspondiente
router.get('/compras', comprasController.mostrarCompras);

// Esta ruta procesa la compra que el usuario ha enviado a través del formulario.
// Cuando el usuario envía los datos del formulario de compra, el sistema maneja esa información aquí.
router.post('/compras', comprasController.procesarCompra);

// Finalmente, exportamos el conjunto de rutas para que pueda ser usado en otras partes del sistema
module.exports = router;