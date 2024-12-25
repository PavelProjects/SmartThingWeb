<script>
export default {
  name: 'LoadingButton',
  props: {
    testId: String,
    loading: Boolean,
    disabled: Boolean
  },
  emits: ['click'],
  computed: {
    style() {
      if (this.disabled) {
        return { cursor: 'not-allowed' }
      }
      if (this.loading) {
        return { cursor: 'wait' }
      }
      return {}
    }
  }
}
</script>

<template>
  <button
    class="loading-button"
    :id="testId"
    :disabled="loading || disabled"
    :style="style"
    @click.stop="() => $emit('click')"
  >
    <slot></slot>
  </button>
</template>

<style scoped>
.loading-button {
  background-color: var(--color-accent);
  border-color: transparent;
  border-radius: var(--border-radius);
  min-width: 90px;
  color: var(--color-text-button);
}

.loading-button:hover {
  opacity: 0.5;
}
</style>
