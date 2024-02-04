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
  <div class="overlay" @click.stop="clickOutside">
    <div class="dialog" @click.stop="() => {}">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background-color: var(--background-tilt);
  z-index: 999;
}
.dialog {
  position: fixed;
  width: 450px;
  height: fit-content;
  left: calc(50% - 200px);
  top: calc(50% - 50px);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  row-gap: var(--default-gap);
  background-color: var(--color-background-mute);
  padding: 5px;
}
</style>
