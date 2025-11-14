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

//Obtener una materia por ID
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
  validacionesMateria,
  verificarValidaciones,
  async (req, res) => {
    const { nombre, codigo, anio, } = req.body;

    try {
        //Verificamos el codigo
        const [result] = await db.execute(
            "INSERT INTO Materia (nombre, codigo, anio) VALUES (?, ?, ?)",
            [nombre, codigo, anio]
        );

        res.status(201).json({
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
            .status(500)
            .json({success: false, message: "Error del servidor" });
    }
  }
);

//Modifacion de una materia
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  validacionesMateria,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { nombre, codigo, anio } = req.body;

    try {
      //Verificar que la materia exista
      const [codigoExistente] = await db.execute("SELECT * FROM Materia WHERE codigo = ? AND id != ?",
        [codigo, id]
      );

      if (codigoExistente.length > 0) {
        return res.status(400).json({ 
            success: false, 
            message: "codigo ya existente en otra materia" 
        });
      }
        
      //Actualizamos
        const [result] = await db.execute(
        "UPDATE Materia SET nombre = ?, codigo = ?, anio = ? WHERE id = ?",
        [nombre, codigo, anio, id]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Materia no encontrada" });
      }

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

    try {
      const [result] = await db.execute("DELETE FROM Materia WHERE id = ?", 
        [id]
    );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Materia no encontrada" });
      }

      res.json({ success: true, data: { id } });
    } catch (error) {
      //Error si la materia está en uso
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({success: false,
          message:"No se puede borrar la materia, ya tiene notas asociadas.",
        });
      }
      console.error("Error al borrar Materia:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error interno del servidor" });
    }
  }
);

export default router;