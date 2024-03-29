<script>
export default {
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
    }
  },
  emits: ["update:modelValue"],
  computed: {
    notValid() {
      return this.required && !this.modelValue
    }
  }
}
</script>

<template>
  <div class="field-container">
    <h2 class="field-label">{{ label }}</h2>
    <input
      :checked="modelValue"
      @input="$emit('update:modelValue', $event.target.checked)"
      type="checkbox"
      :class="{ legit: !validationFailed, required: validationFailed }"
    />
  </div>
</template>

<style scoped>
  input {
    margin: auto 0;
    height: 20px;
    width: 20px;
  }
</style>