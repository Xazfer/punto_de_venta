// models/db.js
// Este archivo se encarga de **conectar a la base de datos MySQL** usando mysql2.

// Importamos la librería mysql2 (es la que usamos para conectarnos)
const mysql = require("mysql2");

// Configuramos los datos de la conexión.
// Estos datos corresponden a un servidor local (XAMPP) que usamos en desarrollo.
const connection = mysql.createConnection({
    host: "localhost",    // El servidor de MySQL está en nuestra computadora
    user: "root",         // Usuario por defecto en XAMPP (sin contraseña)
    password: "",         // Contraseña vacía (default de XAMPP)
    database: "punto_de_venta",  // Nombre de la base de datos que creamos para el sistema
    decimalNumbers: true, // Opción importante: hace que los campos DECIMAL/FLOAT se devuelvan como números (no como strings)
});

// Intentamos conectarnos a la base de datos inmediatamente al cargar este archivo
connection.connect((err) => {
    if (err) {
        console.error("¡Error al conectar a la base de datos!", err);
        return;
    }
    console.log("¡Conexión exitosa a la base de datos!");
});

// Exportamos el objeto `connection`
// Así podemos usar la misma conexión en todos los controladores (compras, ventas, etc.)
module.exports = connection;