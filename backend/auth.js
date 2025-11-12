import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Opciones de configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Creo estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      // Si llegamos a este punto es porque el token es valido
      // Si hace falta realizar algun paso extra antes de llamar al handler de la API
      next(null, {
        userId: payload.userId,
        nombre: payload.nombre,
      });
    })
  );
}

//Middleware para proteger rutas
export const verificarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

// -- Ruta De Login --
router.post(
  "/login",
  body("email", "El email es inválido").isEmail(),
  body("password", "La contraseña debe tener al menos 8 caracteres y 1 número")
    .isStrongPassword({
        minLength: 8, // Minimo de 8 caracteres
        minLowercase: 1, // Al menos una letra en minusculas
        minUppercase: 0, // Letras mayusculas opcionales
        minNumbers: 1, // Al menos un número
        minSymbols: 0, // Símbolos opcionales
    }),
  verificarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    //Consultar por el usuario a la base de datos
    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuarios.length === 0) {
      return res
        .status(400)
        .json({ success: false, error: "usuario invalido" });
    }

    //Verificar la contraseña
    const usuario = usuarios[0];
    const passwordComparada = await bcrypt.compare(password, usuario.password);

    if (!passwordComparada) {
      return res
        .status(400)
        .json({ success: false, error: "Credencial invalida" });
    }

    // Generar jwt
    const payload = { userId: usuario.id, nombre: usuario.nombre };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "4h", //Como se trata de alumnos, espira en 4 hs
    });

    // Devolver jwt y otros datos
    res.json({
      success: true,
      token,
      id: usuario.id,
      nombre: usuario.nombre,
    });
  }
);

// -- Ruta De Registro
router.post(
  "/resgitro",
  //Validamos el registro
  body("nombre", "El nombre es obligatorio").isAlpha("es-ES").isLength({ max: 50}),
  body("email", "El email es invalido").isEmail(),
  body("password", "La contraseña debe tener al menos 8 caracteres y 1 número")
    .isStrongPassword({
        minLength: 8, // Minimo de 8 caracteres
        minLowercase: 1, // Al menos una letra en minusculas
        minUppercase: 0, // Letras mayusculas opcionales
        minNumbers: 1, // Al menos un número
        minSymbols: 0, // Símbolos opcionales
    }),
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;

    try {
        //Verificamos el mail ya existe
        const [existentes] = await db.execute(
            "SELECT * FROM Usuarios WHERE email = ?",
            [email]
        );

        if (existentes.lenght > 0) {
            return res
                .status(400)
                .json({ success: false, message: "El email ya existe" });
        }

        //Encriptamos la contraeña
        const hashedPassword = await bcrypt.hash(password, 12);
        
        //Insertamos la BD
        const [result] = await db.execute(
            "INSERT INTO Usuarios (nombre, email, password) VALUES (?, ?, ?)",
            [nombre, email, hashedPassword]
        );

        //Respuesta exitosa
        res.status(201).json({
            success: true,
            data: { id: result.insertId, nombre, email },
        });
    } catch (error) {
        console.error("Error en /registro:", error);
        res
            .status(500)
            .json({ success: false, message: "Error del servidor"});
    }
  }
);    

export default router;