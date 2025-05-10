// controllers/authController.js
// Este archivo es un "controlador" que contiene la lógica para manejar el inicio y cierre de sesión (login y logout).

// Aquí estamos conectando con dos cosas importantes:
const db = require("../models/db"); // Nos conectamos a la base de datos para poder consultar usuarios.

// Exportamos un conjunto de funciones para que se puedan usar en otras partes del sistema.
module.exports = {

    // === FUNCIÓN 1: Mostrar la pantalla de inicio de sesión ===
    mostrarLogin: (req, res) => {
        // Esta función muestra la página de login y no muestra ningún mensaje de error todavía.
        res.render("login", { mensaje: null });
    },

    // === FUNCIÓN 2: Procesar el intento de inicio de sesión ===
    procesarLogin: (req, res) => {
        // Aquí tomamos los datos que la persona escribió en el formulario de login.
        const { usuario, password } = req.body;

        // Preparamos una pregunta (consulta) a la base de datos para buscar si existe un usuario con ese nombre.
        const consulta = "SELECT * FROM usuarios WHERE usuario = ?";
        db.query(consulta, [usuario], (err, resultados) => {

            // Si ocurre un error al buscar en la base de datos, mostramos un mensaje de error.
            if (err) {
                console.error("Error al consultar usuario:", err);
                return res.send("Error del servidor");
            }

            // Si no encontramos ningún usuario con ese nombre, mostramos un mensaje de "usuario o contraseña incorrectos".
            if (resultados.length === 0) {
                return res.render("login", {
                    mensaje: "Usuario o contraseña incorrectos",
                });
            }

            // Si sí encontramos un usuario, lo guardamos en una variable.
            const usuarioBD = resultados[0];

            // Ahora comparamos la contraseña que la persona escribió con la que está guardada en la base de datos.
            // Nota: aquí la comparación es directa (no cifrada). En un sistema real, lo ideal sería usar mayor seguridad.
            if (usuarioBD.password !== password) {
                return res.render("login", {
                    mensaje: "Usuario o contraseña incorrectos",
                });
            }

            // Si la contraseña es correcta, guardamos los datos del usuario en la "sesión" (un espacio que recuerda quién eres mientras navegas).
            req.session.usuario = {
                id: usuarioBD.id_usuario,
                nombre: usuarioBD.nombre,
                rol: usuarioBD.rol,
            };

            // También registramos un "log" (una nota en la base de datos) que indica que este usuario inició sesión.
            const log = "INSERT INTO logs_sesion (id_usuario, accion) VALUES (?, ?)";
            db.query(log, [usuarioBD.id_usuario, "inicio_sesion"], (err2) => {
                if (err2) console.error("Error al registrar log:", err2);
            });

            // Finalmente, llevamos al usuario a la página principal del sistema (dashboard).
            res.redirect("/dashboard");
        });
    },

    // === FUNCIÓN 3: Cerrar sesión ===
    cerrarSesion: (req, res) => {
        // Primero revisamos si hay un usuario con sesión activa.
        if (req.session.usuario) {
            const idUsuario = req.session.usuario.id;

            // Registramos un "log" indicando que este usuario cerró sesión.
            const log = "INSERT INTO logs_sesion (id_usuario, accion) VALUES (?, ?)";
            db.query(log, [idUsuario, "cierre_sesion"], (err2) => {
                if (err2) console.error("Error al registrar cierre sesión:", err2);
            });
        }

        // Borramos la información de la sesión (olvidamos quién era el usuario).
        req.session.destroy();

        // Y lo regresamos a la pantalla de login.
        res.redirect("/login");
    },
};