import express from "express";
import { db } from "./db.js";
import { verificarValidaciones, validacionesNota } from "./validaciones.js";
import { verificarAutenticacion } from "./auth.js";
import { validarId } from "./validaciones.js";

const router = express.Router();

//Obtenemos el listado de las notas con los alumnos y las materias
router.get("/", verificarAutenticacion, async (req, res) => {
    //Calculamos el promedio en las SQL
    const [rows] = await db.execute(`
        SELECT
            n.id,
            n.alumno_id,
            a.nombre AS alumno_apellido,
            a.dni AS alumno_dni,
            n.materia_id,
            m.nombre AS materia_nombre,
            m.codigo AS materia_codigo,
            n.nota1,
            n.nota2,
            n.nota3,
            IFNULL(
                (COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0) + COALESCE(n.nota3, 0)) / 
                ( (CASE WHEN n.nota1 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN n.nota2 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN n.nota3 IS NOT NULL THEN 1 ELSE 0 END) ),
            0) AS promedio
        FROM Nota n
        JOIN Alumno a ON n.alumno_id = a.id
        JOIN Materia m ON n.materia_id = m.id
    `);

    res.json({
        success: true,
        notas: rows,
    });
});

//Cargamos o modificamos las notas
router.post("/", verificarAutenticacion, validacionesNota,
    verificarValidaciones, async (req, res) => {
        const {alumno_id, materia_id, nota1, nota2, nota3 } = req.body;

        try {
            const [result] = await db.execute(
                `
                INSERT INTO Nota (alumno_id, materia_id, nota1, nota2, nota3) 
                VALUES (?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE 
                    nota1 = VALUES(nota1), 
                    nota2 = VALUES(nota2), 
                    nota3 = VALUES(nota3)
                `,
                [alumno_id, materia_id, nota1, nota2, nota3]
            );

            res.status(201).json({
                success: true,
                //sera 0 si se hace UPDATE o el nuevo ID si fue INSERT
                data: { id: result.insertId || req.body.id, ...req.body },
            });
        } catch (error) {
            if (error.code === "ER_NO_REFERENCED_ROW_2") {
                return res.status(400).json({
                    sucess: false,
                    message: "El alumno_id o la materia_id no existen",
                });
            }
            console.error("Error al cargar nota:", error);
            res.status(500).json({
                success: false, messaage: "Error de servidor"
            });
        }
    }
);

//obtenemos todas las notas de un alumno
router.get("/:id", verificarAutenticacion, validarId, async (req, res) => {
        const alumno_id = Number (req.params.id);

        //Verificamos si el alumno existe
        const [alumno] = await db.execute("SELECT * FROM Alumno WHERE id = ?", [alumno_id,]);

        if (alumno.length === 0) {
            return res.status(404).json({
                success: false, messaage: "Alumno no encontrado"
            });
        }

        //buscamos la notas
        const [rows] = await db.execute(`
            SELECT 
                n.id, 
                n.materia_id, 
                m.nombre AS materia_nombre, 
                m.codigo AS materia_codigo,
                m.anio AS materia_anio,
                n.nota1, 
                n.nota2, 
                n.nota3,
                IFNULL(
                (COALESCE(n.nota1, 0) + COALESCE(n.nota2, 0) + COALESCE(n.nota3, 0)) / 
                ( (CASE WHEN n.nota1 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN n.nota2 IS NOT NULL THEN 1 ELSE 0 END) +
                    (CASE WHEN n.nota3 IS NOT NULL THEN 1 ELSE 0 END) ),
                0) AS promedio
            FROM Nota n
            JOIN Materia m ON n.materia_id = m.id
            WHERE n.alumno_id = ?
            `, [alumno_id]);

        res.json({
            success: true,
            notas: rows,
        });
    }
);

export default router;