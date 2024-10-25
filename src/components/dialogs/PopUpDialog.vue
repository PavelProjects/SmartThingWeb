<script>
export default {
  name: 'PopUpDialog',
  emits: ['close'],
  mounted() {
    document.getElementById("modal-dialog")?.showModal()
  },
  methods: {
    clickOutside() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <dialog id="modal-dialog" class="dialog-container" @click.stop="clickOutside" @close="clickOutside">
    <div class="dialog-content" @click.stop="() => {}">
      <slot></slot>
    </div>
  </dialog>
</template>

<style scoped>
.dialog-container {
  margin: auto;
}
.dialog-content {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
}
</style>
