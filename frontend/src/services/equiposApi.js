// Dirección del backend. Se lee del archivo frontend/.env (VITE_API_URL).
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Función común para todas las peticiones a la API
async function request(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    // fetch solo lanza error si no hay comunicación (backend apagado, CORS, red)
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté encendido.',
    );
  }

  if (respuesta.status === 204) return null; // DELETE no trae cuerpo

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    // NestJS envía { message: '...' } o { message: ['...', '...'] }
    const msg = datos?.message;
    throw new Error(
      Array.isArray(msg) ? msg.join('\n') : msg || `Error ${respuesta.status}`,
    );
  }
  return datos;
}

// Una función por cada endpoint de la API
export const equiposApi = {
  listar: () => request('/equipos'), // GET /equipos
  obtener: (id) => request(`/equipos/${id}`), // GET /equipos/:id
  crear: (equipo) =>
    request('/equipos', { method: 'POST', body: JSON.stringify(equipo) }),
  actualizar: (id, equipo) =>
    request(`/equipos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(equipo),
    }),
  eliminar: (id) => request(`/equipos/${id}`, { method: 'DELETE' }),
};
