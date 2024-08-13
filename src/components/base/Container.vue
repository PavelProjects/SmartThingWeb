<script>
export default {
  name: 'Container',
  props: {
    vertical: {
      type: Boolean,
      default: () => false
    },
    gap: {
      type: String,
      default: () => 'var(--default-gap)'
    },
    padding: {
      type: String,
      default: () => 'var(--default-padding)'
    }
  },
  computed: {
    style() {
      return {
        display: 'flex',
        'flex-direction': this.vertical ? 'column' : 'vertical',
        gap: this.gap,
        padding: this.padding
      }
    }
  }
}
</script>

<template>
  <div :style="style">
    <slot></slot>
  </div>
</template>
