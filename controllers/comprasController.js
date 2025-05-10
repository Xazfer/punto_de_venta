// controllers/comprasController.js
// Este archivo se encarga de registrar compras de productos (solo puede usarlo el Gerente).

// Conexión a la base de datos
const db = require('../models/db');

// Exportamos las funciones que se van a usar en otras partes del sistema.
module.exports = {

    // === FUNCIÓN 1: Mostrar la pantalla de compras ===
    mostrarCompras: (req, res) => {
        // Solo los usuarios que tengan el rol de "gerente" pueden acceder a esta pantalla.
        if (req.session.usuario.rol !== 'gerente') {
            return res.send('Acceso denegado. Solo el Gerente puede registrar compras.');
        }

        // Buscamos todos los productos en la base de datos para mostrarlos en pantalla.
        const consulta = 'SELECT * FROM productos';
        db.query(consulta, (err, productos) => {
            // Si hay un error al buscar los productos, mostramos un mensaje de error.
            if (err) {
                console.error('Error al consultar productos:', err);
                return res.send('Error al cargar productos');
            }

            // Si todo salió bien, mostramos la pantalla de compras con la lista de productos y sin mensajes de error.
            res.render('compras', {
                productos,
                mensaje: null
            });
        });
    },

    // === FUNCIÓN 2: Procesar la compra de un producto ===
    procesarCompra: (req, res) => {
        // Nuevamente, verificamos que solo el gerente pueda realizar esta acción.
        if (req.session.usuario.rol !== 'gerente') {
            return res.send('Acceso denegado. Solo el Gerente puede registrar compras.');
        }

        // Tomamos los datos que el gerente escribió en el formulario: el producto y la cantidad a comprar.
        const { id_producto, cantidad } = req.body;
        const idUsuario = req.session.usuario.id;

        // **Paso 1:** Consultar los datos del producto seleccionado.
        const consulta = 'SELECT * FROM productos WHERE id_producto = ?';
        db.query(consulta, [id_producto], (err, resultado) => {
            if (err) {
                console.error('Error al consultar producto:', err);
                return res.send('Error al consultar producto');
            }

            // Si no encontramos el producto, avisamos al usuario.
            if (resultado.length === 0) {
                return res.send('Producto no encontrado');
            }

            // Guardamos los datos del producto encontrado.
            const producto = resultado[0];

            // Calculamos cuál sería el nuevo stock sumando la cantidad que se va a comprar.
            const nuevoStock = producto.stock + parseInt(cantidad);

            // Revisamos si ese nuevo stock no se pasa del "stock máximo permitido".
            if (nuevoStock > producto.stock_max) {
                return res.render('compras', {
                    productos: [producto],
                    mensaje: `Error: La cantidad ingresada excede el stock máximo (${producto.stock_max})`
                });
            }

            // **Paso 2:** Registramos la compra en la tabla de compras.
            const sqlCompra = 'INSERT INTO compras (id_usuario, id_producto, cantidad) VALUES (?, ?, ?)';
            db.query(sqlCompra, [idUsuario, id_producto, cantidad], (err2) => {
                if (err2) {
                    console.error('Error al registrar compra:', err2);
                    return res.send('Error al registrar compra');
                }

                // **Paso 3:** Actualizamos el stock del producto con el nuevo valor.
                const sqlUpdate = 'UPDATE productos SET stock = ? WHERE id_producto = ?';
                db.query(sqlUpdate, [nuevoStock, id_producto], (err3) => {
                    if (err3) {
                        console.error('Error al actualizar stock:', err3);
                        return res.send('Error al actualizar stock');
                    }

                    // **Paso 4:** Registramos un "log" (registro) en la tabla de movimientos de inventario.
                    const sqlLog = 'INSERT INTO logs_inventario (id_usuario, id_producto, accion, cantidad) VALUES (?, ?, ?, ?)';
                    db.query(sqlLog, [idUsuario, id_producto, 'entrada', cantidad], (err4) => {
                        if (err4) console.error('Error al registrar log inventario:', err4);
                    });

                    // **Paso 5:** Mostramos un mensaje confirmando que la compra se realizó correctamente.
                    res.render('compras', {
                        productos: [producto],
                        mensaje: `Compra registrada con éxito. Nuevo stock: ${nuevoStock}`
                    });
                });
            });
        });
    }
};