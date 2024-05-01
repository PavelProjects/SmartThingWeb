<script>
export default {
  name: 'PopUpDialog',
  emits: ['close'],
  methods: {
    clickOutside() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div class="overlay dialog-container" @click.stop="clickOutside">
    <div class="dialog-content" @click.stop="() => {}">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.dialog-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog-content {
  width: fit-content;
  height: fit-content;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
}
</style>
