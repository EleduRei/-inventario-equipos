# Sistema de Inventario de Equipamiento Tecnológico

**Estudiante:** Eduardo Reinoso
**Asignatura:** Lenguaje de Programación Web II
**Instituto Profesional Virginio Gómez, sede Chillán, 2026**

## Descripción

Este proyecto es una aplicación web para llevar el inventario de los equipos tecnológicos de una institución, como notebooks, PC, monitores, proyectores e impresoras. Con la aplicación se pueden ver todos los equipos, buscarlos, registrar uno nuevo, ver su detalle, editarlo y eliminarlo. Los datos se guardan en una base de datos MySQL.

El proyecto tiene dos partes:

- **backend:** una API REST hecha con NestJS que guarda los datos en MySQL.
- **frontend:** la página hecha con Vue que usa esa API.

## Tecnologías utilizadas

- Vue 3 y Vite (frontend)
- NestJS y TypeORM (backend)
- class-validator (validación de datos)
- MySQL (base de datos)
- Postman (para probar la API)
- Git y GitHub

## Requisitos

- Node.js 20 o superior
- MySQL encendido
- Git

## Cómo crear la base de datos

En MySQL ejecuté:

```sql
CREATE DATABASE inventario_tecnologico;
```

La tabla `equipos` no se crea a mano: la crea TypeORM sola cuando se inicia el backend.

Para tener equipos de prueba, después de iniciar el backend una vez, se ejecuta el archivo `database/seed.sql`. Este archivo agrega 6 equipos.

## Variables de entorno

Hay que copiar `backend/.env.example` a un archivo `backend/.env` y poner la contraseña de MySQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=inventario_tecnologico
FRONTEND_URL=http://localhost:5173
```

En el frontend también hay que copiar `frontend/.env.example` a `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

El archivo `.env` no se sube a GitHub porque tiene la contraseña.

## Cómo ejecutar el proyecto

Se necesitan dos terminales.

**Backend:**

```bash
cd backend
npm install
npm run start:dev
```

**Frontend:**

```bash
cd frontend
npm install
npm run dev
```

Después se abre `http://localhost:5173` en el navegador.

## Endpoints de la API

| Método | Ruta | Qué hace |
|---|---|---|
| GET | /equipos | Muestra todos los equipos |
| GET | /equipos/:id | Muestra un equipo por su id |
| POST | /equipos | Registra un equipo |
| PATCH | /equipos/:id | Modifica un equipo |
| DELETE | /equipos/:id | Elimina un equipo |

Si se busca un equipo que no existe, la API responde **404**. Si se envían datos mal escritos, responde **400** con el error.

**Validaciones:**

- El código y el nombre deben tener al menos 3 letras.
- El tipo, la marca, el modelo y la ubicación son obligatorios.
- El estado solo puede ser Disponible, En uso, Mantención o Baja.
- La fecha de adquisición tiene que ser una fecha válida.

## Estructura del proyecto

```
backend/src/
  main.ts            → inicia la API, activa CORS y la validación
  app.module.ts      → conexión con MySQL
  equipos/
    equipos.controller.ts → las rutas de la API
    equipos.service.ts    → la lógica para guardar, buscar, editar y borrar
    entities/             → la tabla equipos
    dto/                  → las reglas de validación

frontend/src/
  App.vue                 → listado, búsqueda y botones
  services/equiposApi.js  → las llamadas a la API con fetch
  components/
    EquipoForm.vue        → formulario para registrar y editar
    EquipoDetalle.vue     → detalle de un equipo

database/seed.sql         → equipos de prueba
```

## Pruebas que hice

**En Postman:**

- GET /equipos → me mostró la lista (200).
- GET /equipos/999 → me dio 404 porque no existe.
- POST sin datos → me dio 400 con los mensajes de error.
- POST con un equipo correcto → me dio 201 y se guardó.
- POST con el estado "Roto" → me dio 400.
- PATCH cambiando el estado → me dio 200.
- DELETE de un equipo → me dio 204.

**En la página:**

- Se ve la lista de equipos guardados en MySQL.
- Pude registrar, ver el detalle, editar y eliminar equipos.
- Al eliminar, la página pide confirmación.
- La búsqueda funciona.
- Si el backend está apagado, aparece un mensaje que dice que no se pudo conectar con el servidor.
- Reinicié el backend y los equipos seguían guardados.

## Uso de Inteligencia Artificial

Usé **Claude (Anthropic)** como apoyo en este proyecto:

- **Explicación:** me dio una guía paso a paso para hacer el proyecto.
- **Generación de código:** me ayudó con el código del backend y del frontend.
- **Depuración:** me ayudó a corregir errores. Por ejemplo, al copiar el código desde un PDF se cortaban las líneas, y GitHub no se actualizaba porque yo no había hecho ningún commit.
- **Documentación:** me ayudó a hacer este README.

**Lo que hice yo:** creé los proyectos, la base de datos y el archivo `.env`, conecté el repositorio con GitHub, hice los commits y probé la API en Postman y la página en el navegador. También revisé los archivos para entender qué hace cada parte del código.
