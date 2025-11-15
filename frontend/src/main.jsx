import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@picocss/pico";

import { AuthPage, AuthProvider } from "./Auth.jsx";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";

//Alumnos
import { Alumnos } from "./Alumnos.jsx";
import { CrearAlumno } from "./CrearAlumno.jsx";
import { ModificarAlumno } from "./ModificarAlumno.jsx";

//Materias
import { Materias } from "./Materias.jsx";
import { CrearMateria } from "./CrearMateria.jsx";
import { ModificarMateria } from "./ModificarMateria.jsx";

//Notas
import { GestionNotas } from "./GestionNotas.jsx";
import { CargarNota } from "./CargarNotas.jsx"; 


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* --- ALUMNOS --- */}
            <Route path="alumnos" element={<AuthPage><Alumnos /></AuthPage>} />
            <Route path="alumnos/crear" element={<AuthPage><CrearAlumno /></AuthPage>} />
            <Route path="alumnos/:id/modificar" element={<AuthPage><ModificarAlumno /></AuthPage>} />
            
            {/* ---  MATERIAS  --- */}
            <Route path="materias" element={<AuthPage><Materias /></AuthPage>} />
            <Route path="materias/crear" element={<AuthPage><CrearMateria /></AuthPage>} />
            <Route path="materias/:id/modificar" element={<AuthPage><ModificarMateria /></AuthPage>} />
            
            {/* --- NOTAS --- */}
            <Route
              path="notas"
              element={
                <AuthPage>
                  <GestionNotas />
                </AuthPage>
              }
            />
            {/* pagina del formulario */}
            <Route
              path="notas/cargar"
              element={
                <AuthPage>
                  <CargarNota />
                </AuthPage>
              }
            />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);