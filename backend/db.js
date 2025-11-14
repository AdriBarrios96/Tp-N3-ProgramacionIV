import mysql from "mysql2/promise";

export let db;

// Conexion a base de datos
export async function conectarDB() {
    try {
        db = await mysql.createConnection({
            host: process.env.DB_HOST, // Dominio (url) de db
            user: process.env.DB_USER, // Usuario
            password: process.env.DB_PASS, // Contraseña
            database: process.env.DB_NAME, // Esquema
        });
        console.log("Conexion a l abase de datos exitosa.");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
        process.exit(1)
    }
}