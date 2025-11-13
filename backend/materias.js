import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones, validacionesMateria } from "./validaciones.js";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

//Obtenemos las materias
router.get("/", verificarAutenticacion, async (req, res) => {
  const [rows] = await db.execute("SELECT * FROM Materia");
  res.json({
    success: true,
    materias: rows,
  });
});

//Obtener un alumno por ID
router.get(
"/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM Materias WHERE id = ?", [id] );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Materia no encontrada" });
    }

    res.json({ success: true, materia: rows[0] }); //Devolvemos una materia
  }
);

//Creamos una nueva materia
router.post(
  "/",
  verificarAutenticacion,
  validacionAlumno,
  verificarValidaciones,
  async (req, res) => {
    const { nombre, codigo, anio, } = req.body;

    try {
        //Verificamos el codigo
        const [existentes] = await db.execute(
            "SELECT * FROM Materia WHERE dni = ?",
            [codigo]
        );

        if (existentes.length > 0) {
            return res
                .status(400)
                .json({ success: false, message: "El codigo de la materia ya existe" });
        }

        //Insertamos una nueva materia
        const [result] = await db.execute(
            "INSERT INTO Materia (nombre, codigo, anio) VALUES (?,?,?,?)",
            [nombre, codigo, anio ]
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, nombre, codigo, anio },
        });
    } catch (error) {
        //Manejo de errores
        if (error.code === "ER_DUP_ENTRY") {
            return res 
                .status(400)
                .json({success: false, message: "El codigo de la materia ya existe" });
        }
        console.error("Error al crear Materia.", error);
        res
            .status(400)
            .json({success: false, message: "Error del servidor" });
    }
  }
);

//Modifacion de una materia
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  validacionesAlumno,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, codigo, anio } = req.body;

    try {
      //Verificar que la materia exista
      const [rows] = await db.execute("SELECT * FROM Materia WHERE id = ?", [id]);
      if (rows.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Materia no encontrada" });
      }

      //Verificamos si el codigo esta ligado a otra materia
      const [dniExistente] = await db.execute(
        "SELECT * FROM Materia WHERE dni = ? AND id != ?",
        [codigo, id]
      );
      if (codigoExistente.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: "codigo ya existente en otra materia" 
        });
      }

      //Actualizamos
      await db.execute(
        "UPDATE Materia SET nombre = ?, codigo = ?, anio = ? WHERE id = ?",
        [nombre, codigo, anio, id]
      );

      res.json({
        success: true,
        data: { id, nombre, codigo, anio },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ 
            success: false, 
            message: "Codigo ya existente en otra materia" });
      }
      console.error("Error al modificar materia:", error);
      res
        .status(500)
        .json({ success: false, message: "Error del servidor" });
    }
  }
);

//Borrar materia
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    //verificamos si existe o no la materia antes de borrarla
    const [rows] = await db.execute("SELECT * FROM Materia WHERE id = ?", [id]);
    if (rows.length === 0) {
        return res
            .status(400)
            .json({ success: false, message: "Materia no encontrado" });
    }
    
    await db.execute("DELETE FROM Materia WHERE id=?", [id]);
    res.json({ success: true, data: id });
  }
);

export default router;