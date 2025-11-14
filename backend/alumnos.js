import express from "express";
import { db } from "./db.js";
import { validarId, verificarValidaciones, validacionesAlumno } from "./validaciones.js";
import { verificarAutenticacion } from "./auth.js";

const router = express.Router();

//Obtenemos los alumnos
router.get("/", verificarAutenticacion, async (req, res) => {
  const { userId } = req.user;
  const [rows] = await db.execute("SELECT * FROM Alumno WHERE usuario_id = ?", [userId]);
  
  res.json({
    success: true,
    alumnos: rows,
  });
});

//Obtener un alumno por ID
router.get(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { userId } = req.user;
    const id = Number(req.params.id);
    const [rows] = await db.execute("SELECT * FROM Alumno WHERE id = ? AND usuario_id = ?", [id, userId]);

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Alumno no encontrado" });
    }

    res.json({ success: true, alumno: rows[0] }); //Devolvemos un alumno
  }
);

//Creamos un nuevo alumno
router.post(
  "/",
  verificarAutenticacion,
  validacionesAlumno,
  verificarValidaciones,
  async (req, res) => {
    const { userId } = req.user;
    const { nombre, apellido, dni, } = req.body;

    try {
        const [result] = await db.execute(
            "INSERT INTO Alumno (nombre, apellido, dni, usuario_id) VALUES (?, ?, ?, ?)",
            [nombre, apellido, dni, userId]
        );

        res.status(201).json({
            success: true,
            data: { id: result.insertId, nombre, apellido, dni },
        });
    } catch (error) {
        //Manejo de errores
        if (error.code === "ER_DUP_ENTRY") {
            return res 
                .status(400)
                .json({success: false, message: "El DNI ya esta registrado" });
        }
        console.error("Error al crear alumno.", error);
        res
            .status(400)
            .json({success: false, message: "Error del servidor" });
    }
  }
);

//Modifacion de un alumno protegido
router.put(
  "/:id",
  verificarAutenticacion,
  validarId,
  validacionesAlumno,
  verificarValidaciones,
  async (req, res) => {
    const { userId } = req.user;
    const id = Number(req.params.id);
    const { nombre, apellido, dni } = req.body;

    try {
      //Verificar que el alumno exista
      const [dniExistente] = await db.execute("SELECT * FROM Alumno WHERE dni = ? AND id != ? AND usuario_id = ?", [dni, id, userId]);
      if (dniExistente.length > 0) {
        return res
          .status(404)
          .json({ success: false, message: "El DNI ya pertenece a otro alumno" });
      }

      //Verificamos si el DNI esta ligado a otro alumno
      const [result] = await db.execute("UPDATE Alumno SET nombre = ?, apellido = ?, dni = ? WHERE id = ? AND usuario_id",
        [nombre, apellido, dni, id, userId]
      );

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Alumno no encontrado" });
      }

      res.json({
        success: true,
        data: { id, nombre, apellido, dni },
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ 
            success: false, 
            message: "DNI ya existente en otro alumno" });
      }
      console.error("Error al modificar alumno:", error);
      res.status(500).json({ 
        success: false, 
        message: "Error del servidor" });
    }
  }
);

//Borrar alumno
router.delete(
  "/:id",
  verificarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const { userId } = req.user;
    const id = Number(req.params.id);

    //verificamos si existe o no el alumno antes de borrarlo
    const [result] = await db.execute("SELECT * FROM Alumno WHERE id = ? AND usuario_id = ?", [id, userId]);

    if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Alumno no encontrado" });
    }
    
    res.json({ success: true, data: id });
  }
);

export default router;