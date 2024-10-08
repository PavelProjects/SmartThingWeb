<script>
import Container from '../Container.vue'
export default {
  components: { Container },
  props: {
    label: String,
    title: String,
    vertical: {
      type: Boolean,
      default: () => true
    }
  },
  computed: {
    labelStyle() {
      if (!this.vertical) {
        return {
          'text-align': 'center',
          flex: ' 1 0 auto'
        }
      }
      return {}
    }
  }
}
</script>

<template>
  <Container :vertical="vertical">
    <h3 v-if="label" class="field-label" :style="labelStyle">{{ label }}</h3>
    <slot></slot>
  </Container>
</template>
