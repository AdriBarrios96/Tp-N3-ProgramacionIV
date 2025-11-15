import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "./Auth.jsx";
import { Ingresar } from "./Ingresar.jsx"; 

export function Layout() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <main className="container">
      <nav>
        <ul>
          <li>
            <strong>Gestión de Notas</strong>
          </li>
        </ul>
        <ul>
          <li>
            <Link to="/">Inicio</Link>
          </li>
          {/* Los links se muestran SOLO si el usuario se logea */}
          {isAuthenticated && (
            <>
              <li>
                <Link to="/alumnos">Alumnos</Link>
              </li>
              <li>
                <Link to="/materias">Materias</Link>
              </li>
              <li>
                <Link to="/notas">Cargar Notas</Link>
              </li>
            </>
          )}
        </ul>
        <ul>
          <li>
            {/* Cambiamos el botón */}
            {isAuthenticated ? (
              <button
                className="secondary"
                onClick={() => logout()}
              >
                Salir
              </button>
            ) : (
              <Ingresar />
            )}
          </li>
        </ul>
      </nav>

      <hr />

      <Outlet />

    </main>
  );
}