<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'LoadingButton',
  props: {
    testId: String,
    loading: Boolean,
  },
  components: {
    PulseLoader
  },
  emits: ['click']
}
</script>

<template>
  <button :id="testId" :disabled="loading" class="btn" @click.stop="() => $emit('click')">
    <slot v-if="!loading"></slot>
    <pulse-loader :loading="loading"></pulse-loader>
  </button>
</template>

<style scoped>
.btn {
  background-color: hsla(160, 100%, 37%, 0.2);
  border-color: transparent;
  border-radius: var(--border-radius);
  min-width: 90px;
  color: black;
}

.btn:hover {
  opacity: 0.5;
}
</style>
