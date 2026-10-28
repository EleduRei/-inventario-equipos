# Sistema de Inventario de Equipamiento Tecnológico

Aplicación web para registrar y administrar los equipos tecnológicos de una institución (notebooks, PC, monitores, proyectores, impresoras). Permite **listar, buscar, registrar, ver el detalle, editar y eliminar** equipos, y los datos quedan guardados en una base de datos MySQL.

El proyecto está separado en tres partes que se comunican entre sí:

- **Frontend** en Vue.js: la página que usa la persona.
- **Backend** en NestJS: una API REST que recibe las peticiones, valida los datos y los guarda.
- **Base de datos** MySQL: donde quedan almacenados los equipos.

| | |
|---|---|
| **Estudiante** | Eduardo Reinoso |
| **Asignatura** | Lenguaje de Programación Web II |
| **Evaluación** | Evaluación N.º 2 · Actividad evaluada |
| **Institución** | Instituto Profesional Virginio Gómez · Sede Chillán · 2026 |

---

## 1. Tecnologías utilizadas

| Parte | Tecnología | Para qué la usé |
|---|---|---|
| Frontend | Vue 3 + Vite | Crear la interfaz (listado, formulario, detalle) |
| Frontend | `fetch()` | Hacer las peticiones HTTP a la API y recibir JSON |
| Backend | NestJS | Crear la API REST organizada en módulo, controlador y servicio |
| Backend | TypeORM | Conectar NestJS con MySQL y manejar la tabla como una clase |
| Backend | class-validator / class-transformer | Validar los datos que llegan en los DTO |
| Backend | @nestjs/config | Leer las variables del archivo `.env` |
| Base de datos | MySQL 8 | Guardar los equipos de forma permanente |
| Pruebas | Postman | Probar los endpoints de la API |
| Control de versiones | Git y GitHub | Guardar el avance del proyecto con commits |

---

## 2. Requisitos para ejecutarlo

- **Node.js** 20 o superior (incluye `npm`). Se comprueba con `node -v`.
- **MySQL 8** instalado y encendido (MySQL Server, XAMPP o Laragon).
- **Git**, para clonar el repositorio.
- **Nest CLI**, solo si se quiere generar código nuevo: `npm i -g @nestjs/cli`.

---

## 3. Instalación y ejecución paso a paso

### 3.1 Clonar el repositorio

```bash
git clone https://github.com/EleduRei/-inventario-equipos.git
cd -inventario-equipos
```

### 3.2 Crear la base de datos en MySQL

Entrar a MySQL (`mysql -u root -p`, MySQL Workbench o phpMyAdmin) y ejecutar:

```sql
CREATE DATABASE inventario_tecnologico CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
SHOW DATABASES;
```

La tabla `equipos` **no se crea a mano**: la crea TypeORM automáticamente la primera vez que se inicia el backend, a partir de la entidad `Equipo` (por la opción `synchronize: true`).

### 3.3 Configurar las variables de entorno

**Backend:** copiar `backend/.env.example` con el nombre `backend/.env` y escribir la contraseña de MySQL:

```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña_de_mysql
DB_DATABASE=inventario_tecnologico
FRONTEND_URL=http://localhost:5173
```

**Frontend:** copiar `frontend/.env.example` con el nombre `frontend/.env`:

```
VITE_API_URL=http://localhost:3000
```

| Variable | Dónde | Qué significa |
|---|---|---|
| `PORT` | backend | Puerto donde funciona la API (3000) |
| `DB_HOST` | backend | Dirección del servidor MySQL |
| `DB_PORT` | backend | Puerto de MySQL (3306 por defecto) |
| `DB_USERNAME` | backend | Usuario de MySQL |
| `DB_PASSWORD` | backend | Contraseña de MySQL |
| `DB_DATABASE` | backend | Nombre de la base de datos: `inventario_tecnologico` |
| `FRONTEND_URL` | backend | Dirección del frontend a la que se le permite usar la API (CORS) |
| `VITE_API_URL` | frontend | Dirección de la API que usa Vue para hacer las peticiones |

> El archivo `.env` **no se sube a GitHub** porque tiene la contraseña real; está incluido en `.gitignore`. Por eso solo se sube `.env.example`, que muestra qué variables hay que llenar, pero sin la contraseña.

### 3.4 Ejecutar el backend

```bash
cd backend
npm install
npm run start:dev
```

Si todo está bien, en la terminal aparece `Nest application successfully started` y las 5 rutas de `/equipos`. La API queda en **http://localhost:3000/equipos**.

### 3.5 Cargar los datos de prueba

Con el backend iniciado al menos una vez (para que exista la tabla), ejecutar en MySQL el archivo `database/seed.sql`:

```bash
mysql -u root -p < database/seed.sql
```

También se puede abrir el archivo en MySQL Workbench y ejecutarlo. Al final muestra el total de equipos (6). Usa `INSERT IGNORE`, así que si un código ya existe esa fila se salta y no da error.

### 3.6 Ejecutar el frontend

En **otra terminal**:

```bash
cd frontend
npm install
npm run dev
```

Abrir **http://localhost:5173** en el navegador.

---

## 4. Endpoints de la API

URL base: `http://localhost:3000`

| Método | Endpoint | Función | Respuestas posibles |
|---|---|---|---|
| GET | `/equipos` | Listar todos los equipos | 200 |
| GET | `/equipos/:id` | Obtener un equipo por su ID | 200, 400 (ID no numérico), 404 (no existe) |
| POST | `/equipos` | Registrar un equipo nuevo | 201, 400 (datos inválidos), 409 (código repetido) |
| PATCH | `/equipos/:id` | Actualizar uno o más campos de un equipo | 200, 400, 404, 409 |
| DELETE | `/equipos/:id` | Eliminar un equipo | 204 (sin contenido), 404 |

### Ejemplo de POST (registrar)

`POST http://localhost:3000/equipos` · Body → raw → JSON

```json
{
  "codigoInventario": "NB-003",
  "nombre": "Notebook Laboratorio 2",
  "tipo": "Notebook",
  "marca": "HP",
  "modelo": "240 G9",
  "ubicacion": "Laboratorio 2",
  "estado": "Disponible",
  "fechaAdquisicion": "2026-04-02"
}
```

Respuesta **201 Created** (MySQL le asigna el `id` automáticamente):

```json
{
  "id": 7,
  "codigoInventario": "NB-003",
  "nombre": "Notebook Laboratorio 2",
  "tipo": "Notebook",
  "marca": "HP",
  "modelo": "240 G9",
  "ubicacion": "Laboratorio 2",
  "estado": "Disponible",
  "fechaAdquisicion": "2026-04-02",
  "observaciones": null
}
```

### Ejemplo de PATCH (actualizar)

Con PATCH solo se envían los campos que cambian.

`PATCH http://localhost:3000/equipos/7`

```json
{
  "estado": "En uso",
  "ubicacion": "Sala 101"
}
```

Respuesta **200 OK** con el equipo completo ya actualizado.

### Ejemplo de error de validación

Si se envía `"estado": "Roto"`, la API responde **400 Bad Request**:

```json
{
  "message": ["El estado debe ser: Disponible, En uso, Mantención o Baja"],
  "error": "Bad Request",
  "statusCode": 400
}
```

---

## 5. Datos del equipo y reglas de validación

| Campo | Tipo en MySQL | Obligatorio | Regla |
|---|---|---|---|
| `id` | int (autoincremental) | Automático | Clave primaria generada por MySQL |
| `codigoInventario` | varchar(50), único | Sí | Mínimo 3 caracteres; no se puede repetir |
| `nombre` | varchar(100) | Sí | Mínimo 3 caracteres |
| `tipo` | varchar(50) | Sí | No vacío (ej.: Notebook, PC, Monitor, Proyector) |
| `marca` | varchar(50) | Sí | No vacío |
| `modelo` | varchar(50) | Sí | No vacío |
| `ubicacion` | varchar(100) | Sí | No vacío |
| `estado` | enum | Sí | Solo: Disponible, En uso, Mantención o Baja |
| `fechaAdquisicion` | date | Sí | Fecha válida en formato AAAA-MM-DD |
| `observaciones` | text | No | Información adicional |

Antes de validar se quitan los espacios del inicio y del final de los textos. Así, un campo con solo espacios (`"   "`) cuenta como vacío y es rechazado.

---

## 6. Estructura del proyecto

```
-inventario-equipos/
├── backend/                         API REST con NestJS
│   ├── src/
│   │   ├── main.ts                  Inicia la API, activa CORS y ValidationPipe
│   │   ├── app.module.ts            Conexión a MySQL con TypeORM usando el .env
│   │   └── equipos/
│   │       ├── equipos.module.ts      Agrupa todo lo del recurso Equipo
│   │       ├── equipos.controller.ts  Recibe las peticiones HTTP (rutas)
│   │       ├── equipos.service.ts     Lógica: buscar, guardar, actualizar, borrar
│   │       ├── entities/
│   │       │   └── equipo.entity.ts   Representa la tabla "equipos"
│   │       └── dto/
│   │           ├── create-equipo.dto.ts  Reglas de validación para crear
│   │           └── update-equipo.dto.ts  Mismas reglas, pero todos opcionales
│   ├── .env.example
│   └── package.json
├── frontend/                        Interfaz con Vue 3 + Vite
│   ├── src/
│   │   ├── main.js                  Monta la aplicación Vue
│   │   ├── App.vue                  Listado, búsqueda, filtros, carga y errores
│   │   ├── services/
│   │   │   └── equiposApi.js        Todas las llamadas fetch() a la API
│   │   └── components/
│   │       ├── EquipoForm.vue       Formulario para registrar y editar
│   │       └── EquipoDetalle.vue    Muestra todos los datos de un equipo
│   ├── .env.example
│   └── package.json
├── database/
│   └── seed.sql                     Script con los equipos de prueba
├── .gitignore                       Evita subir node_modules, dist y .env
└── README.md
```

### Qué hace cada parte del backend

- **Controller** (`equipos.controller.ts`): solo recibe la petición, por ejemplo `GET /equipos/5`, y se la pasa al servicio. No tiene lógica.
- **Service** (`equipos.service.ts`): tiene la lógica. Revisa si el equipo existe (si no, lanza 404), revisa que el código no esté repetido (si lo está, 409) y usa el **Repository** de TypeORM para hablar con MySQL.
- **Entity** (`equipo.entity.ts`): es una clase que representa la tabla. Cada propiedad con `@Column` es una columna.
- **DTO** (`create-equipo.dto.ts`): define qué datos acepta la API y con qué reglas (`@MinLength`, `@IsIn`, `@IsDateString`, etc.).
- **Module** (`equipos.module.ts`): junta el controller, el service y registra la entidad con `TypeOrmModule.forFeature([Equipo])`.

### Qué hace cada parte del frontend

- **`equiposApi.js`**: es el único archivo que usa `fetch()`. Tiene una función por endpoint (`listar`, `obtener`, `crear`, `actualizar`, `eliminar`). Si el backend no responde, devuelve el mensaje *"No se pudo conectar con el servidor"*, y si la API responde con error, saca el `message` que manda NestJS para mostrarlo.
- **`App.vue`**: carga la lista al abrir la página (`onMounted`), filtra con un `computed`, muestra *"Cargando equipos..."* mientras espera y vuelve a pedir la lista después de crear, editar o eliminar.
- **`EquipoForm.vue`**: usa `v-model` para unir cada campo con los datos del formulario. Sirve para crear y para editar.
- **`EquipoDetalle.vue`**: muestra todos los campos de un equipo, pedido con `GET /equipos/:id`.

---

## 7. Cómo funciona una operación completa

Ejemplo: registrar un equipo desde el formulario.

1. La persona llena el formulario en **Vue** (`EquipoForm.vue`) y presiona **Guardar**.
2. `equiposApi.crear()` hace un `fetch()` con **POST** a `http://localhost:3000/equipos` y envía los datos en **JSON**.
3. En **NestJS**, el **CORS** permite la petición porque viene de `http://localhost:5173`.
4. El **ValidationPipe** revisa los datos con las reglas del **DTO**. Si algo está mal, responde **400** con los mensajes y la petición no sigue.
5. El **Controller** recibe el DTO ya validado y llama a `EquiposService.create()`.
6. El **Service** revisa que el código no exista (si existe, **409**) y usa `repository.save()`.
7. **TypeORM** hace el `INSERT` en la tabla `equipos` de **MySQL**, que genera el `id`.
8. La API responde **201 Created** con el equipo en JSON.
9. Vue muestra *"Equipo registrado correctamente"* y vuelve a cargar la lista, así que el equipo nuevo aparece en la tabla.

---

## 8. Decisiones que tomé y por qué

| Decisión | Por qué |
|---|---|
| Usar **PATCH** y no PUT para actualizar | PATCH permite enviar solo los campos que cambian. Por eso `UpdateEquipoDto` usa `PartialType`, que hace opcionales todos los campos. |
| `whitelist` y `forbidNonWhitelisted` en el ValidationPipe | Si alguien envía un campo que no está en el DTO (por ejemplo `"precio"`), la API responde 400 en vez de aceptarlo. Así no se guardan datos que no corresponden. |
| `ParseIntPipe` en las rutas con `:id` | Convierte el id de texto a número. Si llega algo como `abc`, responde 400 antes de consultar la base de datos. |
| Responder **404** con `NotFoundException` | Si el equipo no existe, la API lo indica claramente en vez de devolver un error del servidor. |
| `codigoInventario` único y error **409** | Dos equipos no deberían tener el mismo código de inventario. |
| `dateStrings: true` en la conexión | MySQL devuelve la fecha como texto `AAAA-MM-DD`. Sin esto, la fecha se convierte a UTC y en Chile podía aparecer un día antes. |
| `synchronize: true` | Crea la tabla automáticamente a partir de la entidad. Sirve para aprender y desarrollar, pero en un sistema real se usan migraciones, porque podría borrar columnas. |
| Variables de entorno (`.env`) | Para no escribir la contraseña de MySQL dentro del código ni subirla a GitHub. |
| Un solo archivo `equiposApi.js` para todos los `fetch()` | Si cambia la URL de la API o el manejo de errores, se cambia en un solo lugar. |
| `confirm()` antes de eliminar | La pauta pide confirmar antes de borrar, para evitar eliminar un equipo por error. |
| DELETE responde **204** | Significa que se borró bien y que no hay contenido que devolver. |

---

## 9. Pruebas realizadas

### Pruebas de la API (Postman)

| N.º | Prueba | Petición | Resultado esperado | Resultado obtenido |
|---|---|---|---|---|
| 1 | Listar | `GET /equipos` | 200 y la lista de equipos | ✅ 200, 6 equipos |
| 2 | Consultar uno | `GET /equipos/4` | 200 y el equipo | ✅ 200, Proyector Sala 204 |
| 3 | ID inexistente | `GET /equipos/999` | 404 | ✅ 404 "No existe un equipo con id 999" |
| 4 | ID no numérico | `GET /equipos/abc` | 400 | ✅ 400 (ParseIntPipe) |
| 5 | Crear válido | `POST /equipos` con todos los datos | 201 y el equipo con su id | ✅ 201 Created |
| 6 | Crear sin datos | `POST /equipos` con cuerpo vacío | 400 con todos los mensajes | ✅ 400, mensaje por cada campo |
| 7 | Estado inválido | `POST` con `"estado": "Roto"` | 400 | ✅ 400 "El estado debe ser: Disponible, En uso, Mantención o Baja" |
| 8 | Nombre corto | `POST` con `"nombre": "PC"` | 400 | ✅ 400 "El nombre debe tener al menos 3 caracteres" |
| 9 | Fecha imposible | `POST` con `"fechaAdquisicion": "2026-02-30"` | 400 | ✅ 400 "La fecha de adquisición debe ser una fecha válida" |
| 10 | Campo no declarado | `POST` con `"precio": 500` | 400 | ✅ 400 "property precio should not exist" |
| 11 | Campo con solo espacios | `POST` con `"marca": "   "` | 400 | ✅ 400 "La marca es obligatoria" |
| 12 | Código repetido | `POST` con `"codigoInventario": "NB-001"` | 409 | ✅ 409 "Ya existe un equipo con el código NB-001" |
| 13 | Actualizar | `PATCH /equipos/:id` con `estado` y `ubicacion` | 200 y el equipo actualizado | ✅ 200 |
| 14 | Actualizar inexistente | `PATCH /equipos/999` | 404 | ✅ 404 |
| 15 | Actualizar a código repetido | `PATCH` con `"codigoInventario": "PC-001"` | 409 | ✅ 409 |
| 16 | Eliminar | `DELETE /equipos/:id` | 204 | ✅ 204 y luego `GET` de ese id da 404 |
| 17 | Persistencia | Reiniciar el backend y hacer `GET /equipos` | Los datos siguen ahí | ✅ Los 6 equipos siguen guardados |
| 18 | MySQL detenido | Apagar MySQL y hacer `GET /equipos` | La API informa un error | ✅ 500 "Internal server error" |

### Pruebas de la interfaz (Vue)

| N.º | Prueba | Resultado esperado | Resultado obtenido |
|---|---|---|---|
| 19 | Abrir la página | Muestra la tabla con los equipos de MySQL | ✅ |
| 20 | Buscar "proyector" | Solo aparece el proyector | ✅ 1 resultado |
| 21 | Filtrar por estado "En uso" | Solo equipos en uso | ✅ 2 resultados |
| 22 | Guardar el formulario vacío | Se muestran los mensajes de la API | ✅ |
| 23 | Registrar un equipo válido | Mensaje de éxito y aparece en la tabla sin recargar | ✅ |
| 24 | Botón **Ver** | Muestra el detalle con la fecha en formato DD-MM-AAAA | ✅ |
| 25 | Botón **Editar** y cambiar el estado | Mensaje de éxito y la tabla muestra el nuevo estado | ✅ |
| 26 | Botón **Eliminar** | Pide confirmación y el equipo desaparece de la tabla | ✅ |
| 27 | Backend apagado | Aparece "No se pudo conectar con el servidor..." y botón Reintentar | ✅ |

---

## 10. Historial en GitHub

El proyecto se desarrolló por etapas, y cada etapa quedó guardada con un commit:

| Etapa | Commit | Qué se hizo |
|---|---|---|
| 1. Inicio | `Configuracion inicial frontend y backend` | Proyecto NestJS y proyecto Vue creados |
| 2. Persistencia | `Conexion MySQL y entidad Equipo` | Conexión con TypeORM, `.env` y entidad `Equipo` |
| 3. API | `CRUD y validaciones de equipos` | Endpoints, DTO, servicio, ValidationPipe y CORS |
| 4. Integración | `Consumo de API desde Vue` | Servicio `fetch()`, listado, formulario, detalle y eliminar |
| 5. Cierre | `Pruebas, correcciones y documentacion final` | Datos de prueba, pruebas y este README |

El historial se puede revisar en la pestaña **Commits** del repositorio o con `git log --oneline`.

---

## 11. Declaración de uso de Inteligencia Artificial

En este proyecto usé **Claude (Anthropic)** como apoyo.

| Herramienta | Parte del proyecto | Tipo de apoyo | Qué revisé o hice yo |
|---|---|---|---|
| Claude | Planificación | Explicación: una guía paso a paso con el orden de trabajo y los commits | Seguí la guía en mi computador: creé los proyectos con `nest new` y `npm create vue`, instalé las dependencias y creé la base de datos en MySQL. |
| Claude | Backend (entidad, DTO, servicio, controlador, `main.ts`, `app.module.ts`) | Generación de código y explicación | Al copiar el código desde un PDF se cortaban las líneas y se desordenaban las llaves, y aparecían errores en VS Code. Claude corrigió los archivos. Configuré mi `.env`, levanté el backend y probé con Postman: un POST sin cuerpo me devolvió 400 con los mensajes de validación y un POST con datos correctos me devolvió 201. |
| Claude | Frontend (`equiposApi.js`, `App.vue`, `EquipoForm.vue`, `EquipoDetalle.vue`) | Generación de código y explicación | Creé las carpetas `services` y `components` con Claude, revisé que la página cargara y leí cada archivo para entender `v-model`, `computed`, `onMounted` y el manejo de errores. |
| Claude | Depuración | Depuración | Me ayudó a conectar mi carpeta con GitHub, que estaba vacío porque no había hecho ningún commit, y a corregir un error de escritura en el `CREATE DATABASE`. |
| Claude | Pruebas y README | Revisión y documentación | Revisé la lista de pruebas y este README, y los completé con el estado real del proyecto. |

**Responsabilidad:** aunque usé IA, revisé el código y lo probé funcionando. Puedo explicar el recorrido de una operación (sección 7), la función de cada archivo (sección 6) y las decisiones que tomé (sección 8).
