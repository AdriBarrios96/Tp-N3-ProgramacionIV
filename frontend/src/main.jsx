import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@picocss/pico";

import { AuthPage, AuthProvider } from "./Auth.jsx";
import { Layout } from "./Layout.jsx";
import { Home } from "./Home.jsx";

import { Alumnos } from "./Alumnos.jsx";
import { CrearAlumno } from "./CrearAlumno.jsx"; 
import { ModificarAlumno } from "./ModificarAlumno.jsx"; 


import { Materias } from "./Materias.jsx";
import { GestionNotas } from "./GestionNotas.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* --- ALUMNOS --- */}
            <Route
              path="alumnos"
              element={
                <AuthPage>
                  <Alumnos />
                </AuthPage>
              }
            />
            <Route
              path="alumnos/crear"
              element={
                <AuthPage>
                  <CrearAlumno />
                </AuthPage>
              }
            />
            <Route
              path="alumnos/:id/modificar"
              element={
                <AuthPage>
                  <ModificarAlumno />
                </AuthPage>
              }
            />

            <Route
              path="materias"
              element={
                <AuthPage>
                  <Materias />
                </AuthPage>
              }
            />
            <Route
              path="notas"
              element={
                <AuthPage>
                  <GestionNotas />
                </AuthPage>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);