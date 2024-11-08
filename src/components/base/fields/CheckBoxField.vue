<script>
import FieldContainer from './FieldContainer.vue'
export default {
  components: { FieldContainer },
  props: {
    label: String,
    modelValue: Boolean,
    required: Boolean,
    disabled: {
      type: Boolean,
      default: false
    },
    validationFailed: {
      type: Boolean,
      default: false
    },
    vertical: {
      type: Boolean,
      default: () => true
    }
  },
  emits: ['update:modelValue'],
  computed: {
    notValid() {
      return this.required && !this.modelValue
    }
  }
}
</script>

<template>
  <FieldContainer :label="label" :vertical="vertical">
    <input
      :checked="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
      type="checkbox"
      :class="{ required: validationFailed }"
      :disabled="disabled"
    />
  </FieldContainer>
</template>

<style scoped>
input {
  width: fit-content;
}
</style>
