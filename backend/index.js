import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import authRouter, { authConfig } from "./auth.js";
import alumnosRouter from "./alumnos.js";
import materiasRouter from "./materias.js"; 
import notasRouter from "./notas.js";

  
async function startServer() {
  conectarDB();

  const app = express();
  const port = 3000;

  // Para interpretar body como JSON
  app.use(express.json());

  // Habilito CORS
  app.use(cors());

  authConfig();

  app.get("/", (req, res) => {
    // Responder con string
    res.send("API de gestion de alumnos y notas");
  });

  app.use("/alumnos", alumnosRouter);
  app.use("/auth", authRouter);
  app.use("/materias", materiasRouter);
  app.use("/notas", notasRouter);

  app.listen(port, () => {
    console.log(`La aplicación esta funcionando en el puerto ${port}`);
  });
}
startServer();