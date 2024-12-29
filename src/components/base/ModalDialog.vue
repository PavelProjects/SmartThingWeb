<script>
export default {
  name: 'ModalDialog',
  emits: ['close'],
  props: {
    id: {
      type: String,
      default: () => 'modal-dialog'
    },
    open: Boolean,
    size: {
      type: String,
      validator(value) {
        return ['small', 'regular', 'large'].includes(value)
      }
    }
  },
  data() {
    let width
    switch (this.size) {
      case 'small':
        width = 250
        break
      case 'large':
        width = 550
        break
      default:
        width = 400
    }

    return {
      width: width + 'px'
    }
  },
  mounted() {
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
  <Transition name="fade">
    <dialog
      v-if="open"
      :id="id"
      class="dialog-container"
      @click.stop="closeDialog"
      @close="closeDialog"
    >
      <div class="dialog-content" :style="{ width: width }" @click.stop="() => {}">
        <slot></slot>
      </div>
    </dialog>
  </Transition>
</template>

<style scoped>
.dialog-container {
  margin: auto;
}
.dialog-content {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background);
  box-shadow: var(--color-background) 0px 0px 20px 5px;
}
</style>
