<script setup>
import { computed, onMounted, ref } from 'vue';
import { equiposApi } from './services/equiposApi';
import EquipoForm from './components/EquipoForm.vue';
import EquipoDetalle from './components/EquipoDetalle.vue';

const ESTADOS = ['Disponible', 'En uso', 'Mantención', 'Baja'];

const equipos = ref([]); // datos traídos de MySQL vía API
const cargando = ref(false); // estado de carga
const error = ref(''); // error de comunicación o de la API
const mensaje = ref(''); // confirmaciones
const busqueda = ref('');
const filtroEstado = ref('');
const vista = ref('lista'); // 'lista' | 'formulario' | 'detalle'
const seleccionado = ref(null);

async function cargarEquipos() {
  cargando.value = true;
  error.value = '';
  try {
    equipos.value = await equiposApi.listar();
  } catch (e) {
    error.value = e.message;
  } finally {
    cargando.value = false;
  }
}

// Se recalcula sola cada vez que cambia la búsqueda, el filtro o la lista
const equiposFiltrados = computed(() => {
  const texto = busqueda.value.trim().toLowerCase();
  return equipos.value.filter((eq) => {
    const coincideTexto =
      !texto ||
      [eq.nombre, eq.codigoInventario, eq.tipo, eq.ubicacion].some((c) =>
        c.toLowerCase().includes(texto),
      );
    const coincideEstado = !filtroEstado.value || eq.estado === filtroEstado.value;
    return coincideTexto && coincideEstado;
  });
});

const claseEstado = (estado) =>
  ({
    Disponible: 'disponible',
    'En uso': 'en-uso',
    Mantención: 'mantencion',
    Baja: 'baja',
  })[estado];

function nuevo() {
  seleccionado.value = null;
  mensaje.value = '';
  vista.value = 'formulario';
}

function editar(eq) {
  seleccionado.value = eq;
  mensaje.value = '';
  vista.value = 'formulario';
}

async function verDetalle(id) {
  cargando.value = true;
  error.value = '';
  try {
    seleccionado.value = await equiposApi.obtener(id); // GET /equipos/:id
    vista.value = 'detalle';
  } catch (e) {
    error.value = e.message;
  } finally {
    cargando.value = false;
  }
}

async function alGuardar() {
  mensaje.value = seleccionado.value
    ? 'Equipo actualizado correctamente.'
    : 'Equipo registrado correctamente.';
  seleccionado.value = null;
  vista.value = 'lista';
  await cargarEquipos(); // refresca la interfaz con los datos reales
}

async function eliminar(eq) {
  if (!confirm(`¿Seguro que deseas eliminar "${eq.nombre}" (${eq.codigoInventario})?`)) return;
  error.value = '';
  mensaje.value = '';
  try {
    await equiposApi.eliminar(eq.id);
    mensaje.value = 'Equipo eliminado.';
    vista.value = 'lista';
    await cargarEquipos();
  } catch (e) {
    error.value = e.message;
  }
}

onMounted(cargarEquipos); // al abrir la página, pide la lista
</script>

<template>
  <main class="contenedor">
    <header class="encabezado">
      <h1>Inventario de Equipamiento Tecnológico</h1>
      <button v-if="vista === 'lista'" @click="nuevo">+ Nuevo equipo</button>
    </header>

    <p v-if="mensaje" class="alerta exito">{{ mensaje }}</p>
    <div v-if="error" class="alerta error">
      <span>{{ error }}</span>
      <button class="secundario" @click="cargarEquipos">Reintentar</button>
    </div>

    <EquipoForm
      v-if="vista === 'formulario'"
      :equipo="seleccionado"
      @guardado="alGuardar"
      @cancelar="vista = 'lista'"
    />

    <EquipoDetalle
      v-else-if="vista === 'detalle'"
      :equipo="seleccionado"
      @volver="vista = 'lista'"
      @editar="editar"
      @eliminar="eliminar"
    />

    <section v-else>
      <div class="filtros">
        <input v-model="busqueda" placeholder="Buscar por nombre, código, tipo o ubicación..." />
        <select v-model="filtroEstado">
          <option value="">Todos los estados</option>
          <option v-for="e in ESTADOS" :key="e">{{ e }}</option>
        </select>
      </div>

      <p v-if="cargando" class="cargando">Cargando equipos...</p>
      <p v-else-if="!error && equiposFiltrados.length === 0">No hay equipos que coincidan.</p>

      <div v-else-if="equiposFiltrados.length" class="tabla-scroll">
        <table class="tabla">
          <thead>
            <tr>
              <th>Código</th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Ubicación</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="eq in equiposFiltrados" :key="eq.id">
              <td>{{ eq.codigoInventario }}</td>
              <td>{{ eq.nombre }}</td>
              <td>{{ eq.tipo }}</td>
              <td>{{ eq.ubicacion }}</td>
              <td>
                <span class="estado" :class="claseEstado(eq.estado)">{{ eq.estado }}</span>
              </td>
              <td class="acciones">
                <button class="secundario" @click="verDetalle(eq.id)">Ver</button>
                <button @click="editar(eq)">Editar</button>
                <button class="peligro" @click="eliminar(eq)">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </main>
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; font-family: system-ui, sans-serif; background: #f4f6f8; color: #1f2937; }
.contenedor { max-width: 1100px; margin: 0 auto; padding: 24px 16px; }
.encabezado { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.tarjeta { background: #fff; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
.filtros { display: flex; gap: 8px; margin: 16px 0; flex-wrap: wrap; }
.filtros input { flex: 1; min-width: 220px; }
input, select, textarea { padding: 8px; border: 1px solid #cbd5e1; border-radius: 6px; font: inherit; width: 100%; }
.filtros select { width: auto; }
label { display: flex; flex-direction: column; gap: 4px; font-size: 14px; margin-bottom: 12px; }
.grilla { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0 16px; }
button { padding: 8px 14px; border: none; border-radius: 6px; background: #2563eb; color: #fff; cursor: pointer; font: inherit; }
button:disabled { opacity: 0.6; cursor: wait; }
button.secundario { background: #e5e7eb; color: #1f2937; }
button.peligro { background: #dc2626; }
.acciones { display: flex; gap: 6px; flex-wrap: wrap; }
.tabla-scroll { overflow-x: auto; }
.tabla { width: 100%; border-collapse: collapse; background: #fff; }
.tabla th, .tabla td { padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: left; }
.alerta { padding: 10px 14px; border-radius: 6px; white-space: pre-line; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
.alerta.error { background: #fee2e2; color: #991b1b; }
.alerta.exito { background: #dcfce7; color: #166534; }
.cargando { color: #2563eb; }
.estado { padding: 2px 8px; border-radius: 999px; font-size: 13px; }
.disponible { background: #dcfce7; }
.en-uso { background: #dbeafe; }
.mantencion { background: #fef9c3; }
.baja { background: #e5e7eb; }
.detalle { display: grid; grid-template-columns: 180px 1fr; gap: 8px; }
.detalle dt { font-weight: 600; }
</style>
