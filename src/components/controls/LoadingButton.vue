<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  name: 'LoadingButton',
  props: {
    testId: String,
    loading: Boolean
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
