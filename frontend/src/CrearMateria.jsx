import React, { useState } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom"; 

export function CrearMateria() {
  const { fetchAuth } = useAuth(); //Fetch con token
  const navigate = useNavigate(); //Hook para redirigir
  const [errores, setErrores] = useState(null); //Errores de validación

  const [values, setValues] = useState({
    nombre: "",
    codigo: "",
    anio: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null); //Limpiamos errores anteriores

    try {
      const response = await fetchAuth("http://localhost:3000/materias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          //El año se envia como número
          anio: parseInt(values.anio, 10) 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          //'data.errores' (validaciones) 'data.message' (cdigo duplicado)
          if (data.errores) {
            return setErrores(data.errores);
          } else {
            return alert("Error: " + data.message);
          }
        }
        //Otro error
        return alert("Error: " + data.message);
      }

      //Si todo va bien volvemos a la lista
      navigate("/materias");

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al crear la materia.");
    }
  };

  const getError = (path) => {
    if (errores) {
      const error = errores.find((e) => e.path === path);
      return error ? error.msg : null;
    }
    return null;
  };

  return (
    <article>
      <h2>Crear Nueva Materia</h2>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <label>
            Nombre de la Materia
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
            Código (6 caracteres, ej. "PRG-IV")
            <input
              required
              value={values.codigo}
              onChange={(e) =>
                setValues({ ...values, codigo: e.target.value })
              }
              aria-invalid={!!getError("codigo")}
              maxLength={6}
            />
            <small>{getError("codigo")}</small>
          </label>

          <label>
            Año (ej. 1, 2, 3...)
            <input
              required
              type="number"
              value={values.anio}
              min="1"
              max="7"
              onChange={(e) => setValues({ ...values, anio: e.target.value })}
              aria-invalid={!!getError("anio")}
            />
            <small>{getError("anio")}</small>
          </label>
        </fieldset>

        <div className="grid">
          <input
            type="button"
            className="secondary"
            value="Cancelar"
            onClick={() => navigate("/materias")} // Vuelve a la lista
          />
          <input type="submit" value="Guardar Materia" />
        </div>
      </form>
    </article>
  );
}