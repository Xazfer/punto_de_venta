// routes/inventarioRoutes.js
// Este archivo define las "rutas" que gestionan las operaciones relacionadas con el inventario de productos

const express = require('express'); // Se utiliza para gestionar las peticiones del navegador
const router = express.Router(); // Crea un conjunto de rutas para el módulo de inventario
const inventarioController = require('../controllers/inventarioController'); // Aquí se encuentra la lógica que maneja el inventario

// Esta ruta muestra la página de inventario. La página puede mostrar todos los productos o permitir buscar productos específicos.
// Cuando el usuario visita "/inventario", se le muestra la pantalla de inventario con la información de los productos.
router.get('/inventario', inventarioController.mostrarInventario);

// Finalmente, exportamos el conjunto de rutas para que pueda ser utilizado en otras partes del sistema
module.exports = router;