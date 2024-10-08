<script>
import Container from '../Container.vue'
import FieldContainer from './FieldContainer.vue'
export default {
  components: { FieldContainer, Container },
  name: 'FielField',
  props: {
    testId: String,
    label: String,
    title: String,
    modelValue: FileList,
    accept: String,
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
  emits: ['update:modelValue'],
  methods: {
    handleChange(event) {
      this.$emit('update:modelValue', event.target.files)
    }
  }
}
</script>

<template>
  <FieldContainer :label="label" :title="title">
    <Container class="input-field-container">
      <input
        class="input-field"
        type="file"
        :accept="accept"
        :id="testId"
        :files="modelValue"
        :disabled="disabled"
        :class="{ required: validationFailed }"
        @change="handleChange"
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
