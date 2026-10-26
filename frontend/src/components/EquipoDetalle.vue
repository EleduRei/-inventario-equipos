<script setup>
defineProps({ equipo: { type: Object, required: true } });
const emit = defineEmits(['volver', 'editar', 'eliminar']);

// '2025-03-15' -> '15-03-2025'
const formatearFecha = (f) => (f ? f.split('-').reverse().join('-') : '');
</script>

<template>
  <section class="tarjeta">
    <h2>{{ equipo.nombre }}</h2>
    <dl class="detalle">
      <dt>ID</dt>
      <dd>{{ equipo.id }}</dd>
      <dt>Código de inventario</dt>
      <dd>{{ equipo.codigoInventario }}</dd>
      <dt>Tipo</dt>
      <dd>{{ equipo.tipo }}</dd>
      <dt>Marca</dt>
      <dd>{{ equipo.marca }}</dd>
      <dt>Modelo</dt>
      <dd>{{ equipo.modelo }}</dd>
      <dt>Ubicación</dt>
      <dd>{{ equipo.ubicacion }}</dd>
      <dt>Estado</dt>
      <dd>{{ equipo.estado }}</dd>
      <dt>Fecha de adquisición</dt>
      <dd>{{ formatearFecha(equipo.fechaAdquisicion) }}</dd>
      <dt>Observaciones</dt>
      <dd>{{ equipo.observaciones || 'Sin observaciones' }}</dd>
    </dl>
    <div class="acciones">
      <button @click="emit('editar', equipo)">Editar</button>
      <button class="peligro" @click="emit('eliminar', equipo)">Eliminar</button>
      <button class="secundario" @click="emit('volver')">Volver al listado</button>
    </div>
  </section>
</template>
