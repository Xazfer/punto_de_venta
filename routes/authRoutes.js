// routes/authRoutes.js
// Este archivo define las "rutas", es decir, los caminos o direcciones que sigue el sistema
// cuando un usuario quiere iniciar sesión, cerrar sesión o entrar al panel principal (dashboard)

const express = require("express"); // Se usa para manejar peticiones del navegador
const router = express.Router(); // Crea un conjunto de rutas agrupadas
const authController = require("../controllers/authController"); // Aquí está la lógica que se ejecuta en cada ruta

// Cuando el usuario abre la página de login (inicio de sesión),
// se muestra el formulario para que escriba su usuario y contraseña
router.get("/login", authController.mostrarLogin);

// Cuando el usuario presiona el botón de "Ingresar" en el formulario de login,
// esta ruta recibe los datos y verifica si son correctos
router.post("/login", authController.procesarLogin);

// Esta ruta se usa para cerrar sesión.
// El sistema borra la información del usuario guardada en la sesión
// y lo redirige al login nuevamente
router.get("/logout", authController.cerrarSesion);

// Esta ruta lleva al usuario al "dashboard", que es la pantalla principal del sistema.
// Pero antes de mostrarlo, el sistema revisa si el usuario ha iniciado sesión.
// Si no ha iniciado sesión, lo envía al formulario de login.
router.get("/dashboard", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/login"); // Si no hay sesión, manda al login
    }

    res.render("dashboard"); // Si hay sesión, muestra el panel principal
});

// Por último, este archivo se exporta para que pueda ser usado en otras partes del sistema
module.exports = router;
