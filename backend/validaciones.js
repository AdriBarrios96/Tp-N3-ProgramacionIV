import { body, param, validationResult } from "express-validator";

export const validarId = param("id", "El ID debe ser entero").isInt({ min: 1, });

//Validacion para alumnos
export const validacionesAlumno = [
  body("nombre", "El campo nombre es obligatorio")
    .isAlpha("es-ES", { ignore: " " }) //Permitimos espacios en el nombre
    .isLength({ min: 2, max: 100 })
    .trim(),
  body("apellido", "El campo apellido es obligatorio")
    .isAlpha("es-ES", { ignore: " " })
    .isLength({ min: 2, max: 100 })
    .trim(),
  body("dni", "El campo DNI es obligatorio (entr 7 u 8 dígitos)")
    .isNumeric()
    .isLength({ min: 7, max: 8 }),
];

//Validacion para MAterias
export const validacionesMateria = [
  body("nombre", "El nombre de la materia es obligatorio")
    .isString()
    .isLength({ min: 3, max: 100 })
    .trim(),
  body("codigo", "El código debe tener 6 caracteres (ej. 101-A)")
    .isString()
    .isLength({ min: 6, max: 6 })
    .trim(),
  body("anio", "El año debe ser un número entre 1 y 7")
    .isInt({ min: 1, max: 7 }),
];

//Middleware verifaciones
export const verificarValidaciones = (req, res, next) => {
  const validacion = validationResult(req);
  if (!validacion.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Falla de validacion",
      errores: validacion.array(),
    });
  }
  next();
};