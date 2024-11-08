<script>
import BaseContainer from '../BaseContainer.vue'
export default {
  components: { BaseContainer },
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
  <BaseContainer :vertical="vertical" class="field-container">
    <h3 v-if="label" class="field-label" :style="labelStyle">{{ label }}</h3>
    <slot></slot>
  </BaseContainer>
</template>
