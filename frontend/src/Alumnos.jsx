import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router-dom";

export function Alumnos() {
  const { fetchAuth } = useAuth(); //Fetch con token

  const [alumnos, setAlumnos] = useState([]);

  //Usamos useCallback para que la funcion no se cree varias veces
  const fetchAlumnos = useCallback(
    async () => {
      try {
        const response = await fetchAuth("http://localhost:3000/alumnos");
        const data = await response.json();

        if (response.ok) {
          setAlumnos(data.alumnos);
        } else {
          //Error del backend
          console.error("Error al cargar alumnos:", data.message);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    },
    [fetchAuth]
  );

  useEffect(() => {
    fetchAlumnos();
  }, [fetchAlumnos]); //Se ejecutara cuando fetchAlumnos cambia

  const handleQuitar = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este alumno?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok) {
          // Si se borra actualizar lista alumnos
          await fetchAlumnos();
        } else {
          alert("Error al eliminar alumno: " + data.message);
        }
      } catch (error) {
        console.error("Error de conexión al eliminar:", error);
        alert("Error de conexión, no se pudo eliminar alumno.");
      }
    }
  };

  return (
    <article>
      <h2>Gestión de Alumnos</h2>
      <Link to="/alumnos/crear" role="button">
        Nuevo Alumno
      </Link>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>DNI</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>{alumno.dni}</td>
              <td>
                <div className="grid">
                  <Link
                    to={`/alumnos/${alumno.id}/modificar`}
                    role="button"
                    className="secondary"
                  >
                    Modificar
                  </Link>
                  <button
                    className="contrast"
                    onClick={() => handleQuitar(alumno.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {alumnos.length === 0 && (
        <p>No hay alumnos Crea el primero!!</p>
      )}
    </article>
  );
}