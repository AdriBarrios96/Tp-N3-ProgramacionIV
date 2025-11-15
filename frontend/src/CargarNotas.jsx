import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
import { useNavigate } from "react-router-dom"; 

export function CargarNota() {
  const { fetchAuth } = useAuth();
  const navigate = useNavigate(); 
  
  // --- ESTADOS ---
  //Menus desplegables
  const [alumnos, setAlumnos] = useState([]);
  const [materias, setMaterias] = useState([]);
  
  const [values, setValues] = useState({
    alumno_id: "",
    materia_id: "",
    nota1: "",
    nota2: "",
    nota3: "",
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        //Lista de alumnos
        const resAlumnos = await fetchAuth("http://localhost:3000/alumnos");
        const dataAlumnos = await resAlumnos.json();
        if (resAlumnos.ok) {
          setAlumnos(dataAlumnos.alumnos);
        } else {
          console.error("Error al cargar alumnos:", dataAlumnos.message);
        }
        
        //Lista de materias
        const resMaterias = await fetchAuth("http://localhost:3000/materias");
        const dataMaterias = await resMaterias.json();
        if (resMaterias.ok) {
          setMaterias(dataMaterias.materias);
        } else {
          console.error("Error al cargar materias:", dataMaterias.message);
        }
      } catch (error) {
        console.error("Error de conexión al cargar listados:", error);
      }
    };

    fetchDropdowns();
  }, [fetchAuth]); //Se ejecuta una vez

  // --- ENVÍO ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!values.alumno_id || !values.materia_id) {
      return alert("Debe seleccionar un alumno y una materia.");
    }

    try {
      const response = await fetchAuth("http://localhost:3000/notas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          alumno_id: parseInt(values.alumno_id),
          materia_id: parseInt(values.materia_id),
          //Si el campo esta vacio, enviamos 'null'
          nota1: values.nota1 === "" ? null : parseFloat(values.nota1),
          nota2: values.nota2 === "" ? null : parseFloat(values.nota2),
          nota3: values.nota3 === "" ? null : parseFloat(values.nota3),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.message || data.errores?.map(e => e.msg).join(', ') || "Error desconocido";
        return alert("Error: " + errorMsg);
      }

      navigate("/notas");

    } catch (error) {
      console.error("Error de conexión:", error);
      alert("Error de conexión al guardar la nota.");
    }
  };

  return (
    <article>
      <h2>Cargar o Modificacion de Notas</h2>
      <p>
        Seleccione un alumno y una materia. Si ya existen, 
        se actualizarán las notas. Si no, se crea un nuevo registro.
      </p>

      <form onSubmit={handleSubmit}>
        <fieldset>
          {/* ALUMNOS */}
          <label>
            Alumno
            <select
              required
              value={values.alumno_id}
              onChange={(e) => setValues({ ...values, alumno_id: e.target.value })}
            >
              <option value="" disabled>Seleccione un alumno...</option>
              {alumnos.map((alumno) => (
                <option key={alumno.id} value={alumno.id}>
                  {alumno.apellido}, {alumno.nombre} (DNI: {alumno.dni})
                </option>
              ))}
            </select>
          </label>

          {/* MATERIAS */}
          <label>
            Materia
            <select
              required
              value={values.materia_id}
              onChange={(e) => setValues({ ...values, materia_id: e.target.value })}
            >
              <option value="" disabled>Seleccione una materia...</option>
              {materias.map((materia) => (
                <option key={materia.id} value={materia.id}>
                  {materia.nombre} (Año: {materia.anio})
                </option>
              ))}
            </select>
          </label>
        </fieldset>

        {/* NOTAS */}
        <fieldset>
          <div className="grid">
            <label>
              Nota 1
              <input
                type="number"
                min="0"
                max="10"
                step="0.01" 
                value={values.nota1}
                onChange={(e) => setValues({ ...values, nota1: e.target.value })}
              />
            </label>
            <label>
              Nota 2
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={values.nota2}
                onChange={(e) => setValues({ ...values, nota2: e.target.value })}
              />
            </label>
            <label>
              Nota 3
              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                value={values.nota3}
                onChange={(e) => setValues({ ...values, nota3: e.target.value })}
              />
            </label>
          </div>
        </fieldset>

        <div className="grid">
          <input
            type="button"
            className="secondary"
            value="Cancelar"
            onClick={() => navigate("/notas")} //Vuelve a la lista
          />
          <input type="submit" value="Guardar Notas" />
        </div>
      </form>
    </article>
  );
}