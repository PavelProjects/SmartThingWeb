<script>
export default {
  name: 'ModalDialog',
  emits: ['close'],
  props: {
    id: {
      type: String,
      default: () => 'modal-dialog'
    },
    open: Boolean
  },
  mounted() {
    console.log(this.id)
    // it's okat bcz we can open only one modal dialog at the moment
    document.getElementById(this.id)?.showModal()
  },
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<template>
  <dialog :id="id" class="dialog-container" @click.stop="closeDialog" @close="closeDialog">
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
  min-width: 400px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
}
</style>
