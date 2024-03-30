<script>
export default {
  name: 'InputField',
  props: {
    testId: String,
    label: String,
    title: String,
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
    },
    errorMessage: String
  },
  emits: ['update:modelValue'],
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
  <div>
    <div class="field-container" :title="title">
      <h2 v-if="label" class="field-label">{{ label }}</h2>
      <div class="input-with-slot">
        <input
          :id="testId"
          :value="modelValue"
          :disabled="disabled"
          :type="type"
          :class="{ required: validationFailed }"
          @input="emitUpdate($event.target.value)"
        />
        <slot></slot>
      </div>
    </div>
    <div v-if="errorMessage">
      <h3 class="error-message">{{ errorMessage }}</h3>
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
.error-message {
  color: var(--color-danger);
  text-align: center;
}
</style>
