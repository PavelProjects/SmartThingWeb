<script>
import FieldContainer from './FieldContainer.vue'

export default {
  name: 'ComboBoxField',
  components: { FieldContainer },
  props: {
    testId: String,
    label: String,
    items: [Array, Object],
    modelValue: [String, Boolean],
    notBlank: {
      type: Boolean,
      default: false
    },
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
    mapedItems() {
      if (Array.isArray(this.items)) {
        return this.mapDefault()
      }
      if (this.items instanceof Object) {
        return this.mapObject()
      }
      console.error("Can't map type " + typeof this.items)
      return []
    }
  },
  methods: {
    mapObject() {
      return Object.entries(this.items).map(([key, value]) => {
        return {
          key,
          caption: value
        }
      })
    },
    mapDefault() {
      return this.items.map((key) => {
        return {
          key,
          caption: key
        }
      })
    }
  }
}
</script>

<template>
  <FieldContainer :label="label || 'Select:'" :vertical="vertical">
    <select
      class="combo-box-field"
      :id="testId"
      :value="modelValue"
      :disabled="disabled"
      :class="{ required: validationFailed }"
      style="flex: 1 0 auto"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="!notBlank"></option>
      <option v-for="{ key, caption } in mapedItems" :key="key" :value="key">
        {{ caption }}
      </option>
    </select>
  </FieldContainer>
</template>
