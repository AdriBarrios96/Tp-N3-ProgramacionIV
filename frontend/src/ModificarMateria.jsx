import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate, useParams } from "react-router-dom"; // Importamos useParams

export function ModificarMateria() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate();
  const [errores, setErrores] = useState(null);

  //Obtenemos el ID de la materia
  const { id } = useParams(); 

  const [values, setValues] = useState({
    nombre: "",
    codigo: "",
    anio: "",
  });

  //Busca datos de la materia
  useEffect(() => {
    const fetchMateria = async () => {
      try {
        const response = await fetchAuth(`http://localhost:3000/materias/${id}`);
        const data = await response.json();

        if (response.ok) {
          //Formulario para los datos de la materia
          setValues({
            nombre: data.materia.nombre,
            codigo: data.materia.codigo,
            anio: data.materia.anio,
          });
        } else {
          alert("Error: " + data.message);
          navigate("/materias"); //Si la materia no existe, volvemos a la lista
        }
      } catch (error) {
        console.error("Error de conexión:", error);
        alert("Error de conexión al buscar la materia.");
        navigate("/materias");
      }
    };

    fetchMateria();
  }, [id, fetchAuth, navigate]); 

  //Enviamos los cambio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrores(null);

    try {
      const response = await fetchAuth(`http://localhost:3000/materias/${id}`, {
        method: "PUT",
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
          setErrores(data.errores);
          return alert(data.message || "Error de validación");
        }
        return alert("Error: " + data.message);
      }

      navigate("/materias");

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al modificar la materia.");
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
      <h2>Modificar Materia (ID: {id})</h2>
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
            onClick={() => navigate("/materias")}
          />
          <input type="submit" value="Guardar Cambios" />
        </div>
      </form>
    </article>
  );
}