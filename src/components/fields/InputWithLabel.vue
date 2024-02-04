<script>
export default {
  name: 'InputWithLabel',
  props: {
    testId: String,
    label: String,
    value: [String, Number, Boolean],
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    validationFailed: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <div class="field-container">
    <h2 class="field-label">{{ label }}</h2>
    <div class="input-with-slot">
      <input
        :id="testId"
        :value="value"
        :disabled="disabled"
        :type="type"
        :class="{ legit: !validationFailed, required: validationFailed }"
      />
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.field-container .input-with-slot {
  display: flex;
  flex-direction: row;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}
.input-with-slot input {
  width: 100%;
  border: none;
}
</style>
