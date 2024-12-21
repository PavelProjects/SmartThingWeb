<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'LoadingButton',
  props: {
    testId: String,
    loading: Boolean,
    disabled: Boolean
  },
  components: {
    PulseLoader
  },
  emits: ['click']
}
</script>

<template>
  <button
    class="btn"
    :id="testId"
    :disabled="loading || disabled"
    @click.stop="() => $emit('click')"
  >
    <slot v-if="!loading"></slot>
    <pulse-loader :loading="loading"></pulse-loader>
  </button>
</template>

<style scoped>
.btn {
  background-color: #88c0d0;
  border-color: transparent;
  border-radius: var(--border-radius);
  min-width: 90px;
  color: rgb(59, 66, 82);
}

.btn:hover {
  opacity: 0.5;
}
</style>
