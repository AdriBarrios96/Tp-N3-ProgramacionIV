import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router-dom";

export function Materias() {
  const { fetchAuth } = useAuth(); //Fetch con token

  const [materias, setMaterias] = useState([]); //Estado de las materias

  const fetchMaterias = useCallback(
    async () => {
      try {
        const response = await fetchAuth("http://localhost:3000/materias");
        const data = await response.json();

        if (response.ok) {
          setMaterias(data.materias);
        } else {
          console.error("Error al cargar materias:", data.message);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    },
    [fetchAuth] 
  );

  useEffect(() => {
    fetchMaterias();
  }, [fetchMaterias]);

  //Mensaje de borrado
  const handleQuitar = async (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta materia?")) {
      try {
        const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();

        if (response.ok) {
          await fetchMaterias();
        } else {
          alert("Error: " + data.message); 
        }
      } catch (error) {
        console.error("Error de conexión al eliminar:", error);
        alert("Error de conexión no se pudo eliminar la materia.");
      }
    }
  };

  return (
    <article>
      <h2>Gestión de Materias</h2>
      <Link to="/materias/crear" role="button">
        Nueva Materia
      </Link>

      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Código</th>
            <th>Año</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map((materia) => (
            <tr key={materia.id}>
              <td>{materia.nombre}</td>
              <td>{materia.codigo}</td>
              <td>{materia.anio}</td>
              <td>
                <div className="grid">
                  <Link
                    to={`/materias/${materia.id}/modificar`}
                    role="button"
                    className="secondary"
                  >
                    Modificar
                  </Link>
                  <button
                    className="contrast"
                    onClick={() => handleQuitar(materia.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {materias.length === 0 && (
        <p>No hay materias, Crea la primera!!</p>
      )}
    </article>
  );
}