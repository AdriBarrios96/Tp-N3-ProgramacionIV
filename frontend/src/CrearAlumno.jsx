import React, { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom";

export function CrearAlumno() {
  const { fetchAuth } = useAuth(); //Fetch con token
  const navigate = useNavigate(); //Hook para redirigir
  const [errores, setErrores] = useState(null); //Para mostrar errores

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null); // Limpiamos errores anteriores

    try {
      const response = await fetchAuth("http://localhost:3000/alumnos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      //Mostramos los errores de backend (si es que hay)
      if (!response.ok) {
        if (response.status === 400) {
          //Errores de validación
          return setErrores(data.errores);
        }
        return alert("Error: " + data.message);
      }

      navigate("/alumnos");

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al crear el alumno.");
    }
  };

  //Función para encontrar un error de validación específico
  const getError = (path) => {
    if (errores) {
      const error = errores.find((e) => e.path === path);
      return error ? error.msg : null;
    }
    return null;
  };

  return (
    <article>
      <h2>Crear Alumno Nuevo</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre
            <input
              required
              value={values.nombre}
              onChange={(e) =>
                setValues({ ...values, nombre: e.target.value })
              }
              aria-invalid={!!getError("nombre")}
            />
            <small>{getError("nombre")}</small>
          </label>

          <label>
            Apellido
            <input
              required
              value={values.apellido}
              onChange={(e) =>
                setValues({ ...values, apellido: e.target.value })
              }
              aria-invalid={!!getError("apellido")}
            />
            <small>{getError("apellido")}</small>
          </label>

          <label>
            DNI
            <input
              required
              type="text"
              value={values.dni}
              onChange={(e) => setValues({ ...values, dni: e.target.value })}
              aria-invalid={!!getError("dni")}
            />
            <small>{getError("dni")}</small>
          </label>
        </fieldset>

        <div className="grid">
          <input
            type="button"
            className="secondary"
            value="Cancelar"
            onClick={() => navigate("/alumnos")} //Volvemos a la lista
          />
          <input type="submit" value="Guardar Alumno" />
        </div>
      </form>
    </article>
  );
}