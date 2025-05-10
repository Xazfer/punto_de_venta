// controllers/ventasController.js
// Este archivo se encarga de **registrar ventas** y actualizar el inventario cuando se vende un producto.

// Conexión a la base de datos
const db = require('../models/db');

// Exportamos las funciones que se usarán en otras partes del sistema.
module.exports = {

    // === FUNCIÓN: Mostrar la pantalla de ventas ===
    mostrarVentas: (req, res) => {

        // Consultamos todos los productos (para que el usuario pueda elegir qué vender).
        const consulta = 'SELECT * FROM productos';
        db.query(consulta, (err, productos) => {
            if (err) {
                console.error('Error al consultar productos:', err);
                return res.send('Error al cargar productos');
            }

            // Mostramos la pantalla de ventas con:
            // - La lista de productos disponibles
            // - Sin mensaje inicial
            res.render('ventas', {
                productos,
                mensaje: null
            });
        });
    },

    // === FUNCIÓN: Procesar una venta (cuando se envía el formulario) ===
    procesarVenta: (req, res) => {

        // Obtenemos los datos que el usuario escribió en el formulario
        const { id_producto, cantidad, turno } = req.body;

        // Obtenemos el ID del usuario que está haciendo la venta (de la sesión)
        const idUsuario = req.session.usuario.id;

        // 1 — Consultar el producto que se quiere vender
        const consulta = 'SELECT * FROM productos WHERE id_producto = ?';
        db.query(consulta, [id_producto], (err, resultado) => {
            if (err) {
                console.error('Error al consultar producto:', err);
                return res.send('Error al consultar producto');
            }

            // Si no se encuentra el producto
            if (resultado.length === 0) {
                return res.send('Producto no encontrado');
            }

            const producto = resultado[0];

            // Validamos si hay suficiente stock para vender
            if (cantidad > producto.stock) {
                return res.render('ventas', {
                    productos: [producto],
                    mensaje: 'Cantidad excede el stock disponible'
                });
            }

            // Calculamos el total que se va a cobrar
            const subtotal = producto.precio_venta * cantidad;

            // 2 — Registramos la venta en la tabla `ventas`
            const sqlVenta = 'INSERT INTO ventas (id_usuario, turno, total) VALUES (?, ?, ?)';
            db.query(sqlVenta, [idUsuario, turno, subtotal], (err2, resultadoVenta) => {
                if (err2) {
                    console.error('Error al registrar venta:', err2);
                    return res.send('Error al registrar venta');
                }

                // Obtenemos el ID de la venta recién registrada (para registrar su detalle)
                const idVenta = resultadoVenta.insertId;

                // 3 — Registramos el detalle de la venta (producto, cantidad, subtotal)
                const sqlDetalle = 'INSERT INTO detalles_venta (id_venta, id_producto, cantidad, subtotal) VALUES (?, ?, ?, ?)';
                db.query(sqlDetalle, [idVenta, id_producto, cantidad, subtotal], (err3) => {
                    if (err3) {
                        console.error('Error al registrar detalle:', err3);
                        return res.send('Error al registrar detalle de venta');
                    }

                    // 4 — Actualizamos el stock del producto (restamos lo que se vendió)
                    const nuevoStock = producto.stock - cantidad;
                    const sqlUpdate = 'UPDATE productos SET stock = ? WHERE id_producto = ?';
                    db.query(sqlUpdate, [nuevoStock, id_producto], (err4) => {
                        if (err4) {
                            console.error('Error al actualizar stock:', err4);
                            return res.send('Error al actualizar stock');
                        }

                        // 5 — Registramos en los logs de inventario que salió mercancía
                        const sqlLog = 'INSERT INTO logs_inventario (id_usuario, id_producto, accion, cantidad) VALUES (?, ?, ?, ?)';
                        db.query(sqlLog, [idUsuario, id_producto, 'salida', cantidad], (err5) => {
                            if (err5) console.error('Error al registrar log inventario:', err5);
                        });

                        // 6 — Mostramos confirmación de que la venta se registró bien
                        res.render('ventas', {
                            productos: [producto],
                            mensaje: `Venta registrada con éxito. Stock restante: ${nuevoStock}`
                        });
                    });
                });
            });
        });
    }
};