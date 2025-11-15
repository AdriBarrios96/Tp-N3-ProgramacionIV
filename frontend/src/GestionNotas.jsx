import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "./Auth";
import { Link } from "react-router-dom";

export function GestionNotas() {
  const { fetchAuth } = useAuth(); //Fetch con token

  const [notas, setNotas] = useState([]); //Estado de las notas

  //Buscar las notas 
  const fetchNotas = useCallback(
    async () => {
      try {
        const response = await fetchAuth("http://localhost:3000/notas");
        const data = await response.json();

        if (response.ok) {
          setNotas(data.notas); //Guardamos las notas
        } else {
          console.error("Error al cargar notas:", data.message);
        }
      } catch (error) {
        console.error("Error de conexión:", error);
      }
    },
    [fetchAuth] 
  );

  useEffect(() => {
    fetchNotas();
  }, [fetchNotas]);

  return (
    <article>
      <h2>Visualización de Notas</h2>
      <Link to="/notas/cargar" role="button">
        Cargar / Modificar Nota
      </Link>

      <table>
        <thead>
          <tr>
            <th>Alumno (DNI)</th>
            <th>Materia (Código)</th>
            <th>Nota 1</th>
            <th>Nota 2</th>
            <th>Nota 3</th>
            <th>Promedio</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((nota) => (
            <tr key={nota.id}>
              <td>{nota.alumno_apellido}, {nota.alumno_nombre} ({nota.alumno_dni})</td>
              <td>{nota.materia_nombre} ({nota.materia_codigo})</td>
              <td>{nota.nota1 ?? "N/A"}</td>
              <td>{nota.nota2 ?? "N/A"}</td>
              <td>{nota.nota3 ?? "N/A"}</td>
              {/* toFixed(2) muestra solo 2 decimales */}
              <td>{parseFloat(nota.promedio).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {notas.length === 0 && (
        <p>No hay Notas, Crea la primera!!</p>
      )}
    </article>
  );
}