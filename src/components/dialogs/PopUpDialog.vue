<script>
export default {
  name: 'PopUpDialog',
  methods: {
    clickOutside() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <div class="overlay container" @click.stop="clickOutside">
    <div class="dialog" @click.stop="() => {}">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  width: fit-content;
  height: fit-content;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background-mute);
}
</style>
