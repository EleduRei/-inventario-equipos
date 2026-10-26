<script setup>
import { reactive, ref, watch } from 'vue';
import { equiposApi } from '../services/equiposApi';

const props = defineProps({
  equipo: { type: Object, default: null }, // null = crear, objeto = editar
});
const emit = defineEmits(['guardado', 'cancelar']);

const TIPOS = ['Notebook', 'PC', 'Monitor', 'Proyector', 'Impresora', 'Otro'];
const ESTADOS = ['Disponible', 'En uso', 'Mantención', 'Baja'];

const vacio = () => ({
  codigoInventario: '',
  nombre: '',
  tipo: 'Notebook',
  marca: '',
  modelo: '',
  ubicacion: '',
  estado: 'Disponible',
  fechaAdquisicion: '',
  observaciones: '',
});

const form = reactive(vacio());
const guardando = ref(false);
const error = ref('');

// Copia SOLO los campos del DTO (no el id): si se enviara "id" en el PATCH,
// forbidNonWhitelisted respondería 400.
watch(
  () => props.equipo,
  (eq) => {
    const base = vacio();
    for (const campo in base) form[campo] = eq ? (eq[campo] ?? '') : base[campo];
    error.value = '';
  },
  { immediate: true },
);

async function guardar() {
  guardando.value = true;
  error.value = '';
  try {
    const datos = { ...form, observaciones: form.observaciones || null };
    if (props.equipo) await equiposApi.actualizar(props.equipo.id, datos);
    else await equiposApi.crear(datos);
    emit('guardado');
  } catch (e) {
    error.value = e.message; // mensajes de validación de la API
  } finally {
    guardando.value = false;
  }
}
</script>

<template>
  <!-- novalidate: dejamos que la validación la haga la API para mostrar sus mensajes -->
  <form class="tarjeta" novalidate @submit.prevent="guardar">
    <h2>{{ equipo ? 'Editar equipo' : 'Registrar equipo' }}</h2>

    <div class="grilla">
      <label>
        Código de inventario *
        <input v-model="form.codigoInventario" placeholder="NB-001" />
      </label>
      <label>
        Nombre *
        <input v-model="form.nombre" placeholder="Notebook Laboratorio 1" />
      </label>
      <label>
        Tipo *
        <select v-model="form.tipo">
          <option v-for="t in TIPOS" :key="t">{{ t }}</option>
        </select>
      </label>
      <label>
        Marca *
        <input v-model="form.marca" />
      </label>
      <label>
        Modelo *
        <input v-model="form.modelo" />
      </label>
      <label>
        Ubicación *
        <input v-model="form.ubicacion" />
      </label>
      <label>
        Estado *
        <select v-model="form.estado">
          <option v-for="e in ESTADOS" :key="e">{{ e }}</option>
        </select>
      </label>
      <label>
        Fecha de adquisición *
        <input type="date" v-model="form.fechaAdquisicion" />
      </label>
    </div>

    <label>
      Observaciones
      <textarea v-model="form.observaciones" rows="3"></textarea>
    </label>

    <p v-if="error" class="alerta error">{{ error }}</p>

    <div class="acciones">
      <button type="submit" :disabled="guardando">
        {{ guardando ? 'Guardando...' : 'Guardar' }}
      </button>
      <button type="button" class="secundario" @click="emit('cancelar')">
        Cancelar
      </button>
    </div>
  </form>
</template>
