// controllers/cortesController.js
// Este archivo se encarga de generar reportes (cortes) de las ventas realizadas.

// Conexión a la base de datos
const db = require('../models/db');

// Exportamos las funciones que se van a usar en otras partes del sistema.
module.exports = {

    // === FUNCIÓN 1: Mostrar la pantalla para generar cortes ===
    mostrarCortes: (req, res) => {
        // Cuando entramos a la pantalla de cortes, mostramos un formulario vacío (sin ventas aún).
        res.render('cortes', {
            ventas: [],   // No hay ventas listadas todavía
            total: 0,     // El total de las ventas es 0
            mensaje: null // No hay mensajes de error o confirmación
        });
    },

    // === FUNCIÓN 2: Procesar la solicitud de generación del corte ===
    procesarCorte: (req, res) => {
        // Tomamos los datos que el usuario seleccionó en el formulario:
        // - tipo de corte (total o parcial)
        // - fecha de las ventas a consultar
        // - turno (en caso de que sea un corte parcial)
        const { tipo_corte, fecha, turno } = req.body;

        // Si no se seleccionó ninguna fecha, mostramos un mensaje de error.
        if (!fecha) {
            return res.render('cortes', { ventas: [], total: 0, mensaje: 'Debe seleccionar una fecha.' });
        }

        // **Paso 1:** Construimos la consulta a la base de datos para buscar las ventas del día seleccionado.
        let consulta = `
            SELECT ventas.*, usuarios.nombre AS cajero
            FROM ventas
            LEFT JOIN usuarios ON ventas.id_usuario = usuarios.id_usuario
            WHERE DATE(fecha_hora) = ?
        `;
        let params = [fecha]; // Parámetros de la consulta (la fecha que seleccionó el usuario)

        // **Si el usuario pidió un corte parcial (solo un turno)**, agregamos un filtro extra.
        if (tipo_corte === 'parcial' && turno) {
            consulta += ' AND turno = ?';
            params.push(turno);
        }

        // **Paso 2:** Ejecutamos la consulta en la base de datos.
        db.query(consulta, params, (err, resultados) => {
            if (err) {
                console.error('Error al consultar ventas:', err);
                return res.send('Error al consultar ventas');
            }

            // **Paso 3:** Calculamos el total de todas las ventas encontradas.
            const total = resultados.reduce((acum, venta) => acum + parseFloat(venta.total), 0);

            // **Paso 4:** Mostramos la pantalla con las ventas y el total.
            res.render('cortes', {
                ventas: resultados, // Lista de ventas encontradas
                total,              // Suma total de esas ventas
                mensaje: null       // No mostramos mensajes de error porque todo salió bien
            });
        });
    }
};