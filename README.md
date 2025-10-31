# Tp-N3-ProgramacionIV
-- Ejercicio A --
Desarrollar una aplicación web completa que permita gestionar alumnos, materias y sus calificaciones. 
A parte de los requisitos generales el ejercicio debe cumplir lo siguiente:
Frontend:
  ◦ Pantalla principal con paginas de:
    ▪ Listado de alumnos.
    ▪ Listado de materias.
    ▪ Carga y visualización de notas por alumno y materia (hasta 3 notas).
  ◦ Formularios para alta, modificación y eliminación de alumnos y materias.
  ◦ Posibilidad de asignar notas a cada alumno en cada materia.
  ◦ Mostrar el promedio de notas por materia y alumno.
Backend:
  ◦ Estructura de entidades:
    ▪ Usuario: id, nombre, email, contraseña (encriptada con bcrypt).
    ▪ Alumno: id, nombre, apellido, DNI (único).
    ▪ Materia: id, nombre, código, año.
    ▪ Nota: id, alumno_id, materia_id, nota1, nota2, nota3.
