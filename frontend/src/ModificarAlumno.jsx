import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router-dom"; // ¡Importamos useParams!

export function ModificarAlumno() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  //Obtenemos el ID 
  const { id } = useParams(); 

  const [values, setValues] = useState({
    nombre: "",
    apellido: "",
    dni: "",
  });

  //Buscamos datos del alumno
  useEffect(() => {
    const fetchAlumno = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`);
        const data = await response.json();

        if (response.ok) {
          //Colocamos los datos del alumno
          setValues({
            nombre: data.alumno.nombre,
            apellido: data.alumno.apellido,
            dni: data.alumno.dni,
          });
        } else {
          alert("Error: " + data.message);
          navigate("/alumnos"); //Si el alumno no existe vuelve a lista
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión al buscar el alumno.");
        navigate("/alumnos");
      }
    };

    fetchAlumno();
  }, [id, fetchAuth, navigate]);

  //Enviamos los cambios)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    try {
      const response = await fetchAuth(`http://localhost:3000/alumnos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          //Errores de validación
          setErrores(data.errores);
          return alert(data.message || "Error de validación");
        }
        return alert("Error: ", DEC + data.message);
      }

      navigate("/alumnos");

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al modificar el alumno.");
    }
  };

  //Encontrar un error de validación específico
  const getError = (path) => {
    if (errores) {
      const error = errores.find((e) => e.path === path);
      return error ? error.msg : null;
    }
    return null;
  };

  return (
    <article>
      <h2>Modificar Alumno (ID: {id})</h2>
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
            onClick={() => navigate("/alumnos")} // Vuelve a la lista
          />
          <input type="submit" value="Guardar Cambios" />
        </div>
      </form>
    </article>
  );
}