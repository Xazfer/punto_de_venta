// routes/cortesRoutes.js
// Este archivo define las "rutas" que gestionan los cortes de venta en el sistema

const express = require('express'); // Se usa para manejar las solicitudes del navegador
const router = express.Router(); // Crea un conjunto de rutas para los cortes de venta
const cortesController = require('../controllers/cortesController'); // Aquí se encuentra la lógica que maneja los cortes

// Esta ruta muestra la pantalla donde se gestionan los cortes de venta
// Cuando el usuario visita "/cortes", se le muestra la pantalla correspondiente
router.get('/cortes', cortesController.mostrarCortes);

// Esta ruta procesa la información del corte que el usuario envía a través de un formulario.
// Cuando el usuario envía el formulario para generar un corte, el sistema maneja esa información aquí.
router.post('/cortes', cortesController.procesarCorte);

// Al final, exportamos el conjunto de rutas para que pueda ser utilizado en otras partes del sistema
module.exports = router;