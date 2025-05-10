// routes/ventasRoutes.js
// Este archivo define las "rutas" que gestionan las operaciones relacionadas con las ventas

const express = require('express'); // Se utiliza para manejar las solicitudes del navegador
const router = express.Router(); // Crea un conjunto de rutas para las ventas
const ventasController = require('../controllers/ventasController'); // Aquí se encuentra la lógica que maneja las ventas

// Esta ruta muestra la pantalla donde se registran las ventas
// Cuando el usuario visita "/ventas", se le muestra la pantalla correspondiente
router.get('/ventas', ventasController.mostrarVentas);

// Esta ruta procesa la venta que el usuario ha enviado a través del formulario.
// Cuando el usuario envía los datos de una venta, el sistema maneja esa información aquí.
router.post('/ventas', ventasController.procesarVenta);

// Al final, exportamos el conjunto de rutas para que pueda ser utilizado en otras partes del sistema
module.exports = router;