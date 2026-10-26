
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';


async function request(ruta, opciones = {}) {
  let respuesta;
  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      headers: { 'Content-Type': 'application/json' },
      ...opciones,
    });
  } catch {
    
    throw new Error(
      'No se pudo conectar con el servidor. Verifica que el backend esté encendido.',
    );
  }

  if (respuesta.status === 204) return null; 

  const datos = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
   
    const msg = datos?.message;
    throw new Error(
      Array.isArray(msg) ? msg.join('\n') : msg || `Error ${respuesta.status}`,
    );
  }
  return datos;
}


export const equiposApi = {
  listar: () => request('/equipos'), 
  obtener: (id) => request(`/equipos/${id}`), 
  crear: (equipo) =>
    request('/equipos', { method: 'POST', body: JSON.stringify(equipo) }),
  actualizar: (id, equipo) =>
    request(`/equipos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(equipo),
    }),
  eliminar: (id) => request(`/equipos/${id}`, { method: 'DELETE' }),
};
