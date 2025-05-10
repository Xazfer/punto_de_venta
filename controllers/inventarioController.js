// controllers/inventarioController.js
// Este archivo se encarga de mostrar los productos que hay en el inventario,
// y también permite buscar productos por su nombre o por su clave.

// Conexión a la base de datos
const db = require('../models/db');

// Exportamos las funciones que se usarán en otras partes del sistema.
module.exports = {

    // === FUNCIÓN: Mostrar el inventario (con o sin búsqueda) ===
    mostrarInventario: (req, res) => {

        // Revisamos si el usuario escribió algo en la barra de búsqueda.
        const busqueda = req.query.busqueda; 

        // Empezamos con la consulta básica (todos los productos).
        let consulta = 'SELECT * FROM productos';
        let params = []; // Parámetros de la consulta (vacío por ahora)

        // **Si el usuario escribió algo en la búsqueda**, vamos a filtrar.
        if (busqueda) {
            // Buscamos productos donde el nombre o la clave contenga el texto buscado.
            consulta += ' WHERE nombre LIKE ? OR clave LIKE ?';
            const filtro = '%' + busqueda + '%'; // Agregamos % para buscar cualquier coincidencia
            params = [filtro, filtro]; // Usamos el mismo filtro en nombre y clave
        }

        // **Ejecutamos la consulta en la base de datos**.
        db.query(consulta, params, (err, resultados) => {
            if (err) {
                console.error('Error al consultar productos:', err);
                return res.send('Error al consultar productos');
            }

            // Mostramos la pantalla con:
            // - los productos encontrados
            // - el texto de búsqueda actual (para que aparezca en la caja de búsqueda)
            res.render('inventario', {
                productos: resultados,
                busqueda: busqueda || '' // Si no había búsqueda, dejamos la caja vacía
            });
        });
    }
};