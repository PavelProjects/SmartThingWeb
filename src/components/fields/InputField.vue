<script>
export default {
  name: 'InputField',
  props: {
    testId: String,
    label: String,
    modelValue: [String, Number],
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
  },
  emits: ["update:modelValue"],
  methods: {
    emitUpdate(value) {
      let v = value
      if (this.type === 'number') {
        v = Number.parseInt(value)
      }
      this.$emit('update:modelValue', v)
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
        :value="modelValue"
        :disabled="disabled"
        :type="type"
        :class="{ legit: !validationFailed, required: validationFailed }"
        @input="emitUpdate($event.target.value)"
      />
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
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
