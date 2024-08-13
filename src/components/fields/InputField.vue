<script>
import Container from '../base/Container.vue'
import FieldContainer from './FieldContainer.vue'
export default {
  components: { FieldContainer, Container },
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
      // todo replace with smth else
      type: Boolean,
      default: false
    },
    autocomplete: String
  },
  emits: ['update:modelValue', 'enter'],
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
  <FieldContainer :label="label" :title="title">
    <Container class="input-field-container">
      <input
        class="input-field"
        :id="testId"
        :value="modelValue"
        :disabled="disabled"
        :type="type"
        :class="{ required: validationFailed }"
        :autocomplete="autocomplete"
        @input="emitUpdate($event.target.value)"
        @keypress.enter="() => $emit('enter')"
      />
      <slot></slot>
    </Container>
  </FieldContainer>
</template>

<style scoped>
.input-field-container {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}
input {
  flex: 1 0 auto;
  border: none;
}
</style>
