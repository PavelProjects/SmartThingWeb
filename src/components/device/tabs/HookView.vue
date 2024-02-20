<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import InputField from '../../fields/InputField.vue'
import ComboBoxField from '../../fields/ComboBoxField.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import { NEW_HOOK_ID } from './HooksView.vue'
import { h } from 'vue'
import { toast } from '../../../utils/EventBus.js'
import LoadingButton from '../../controls/LoadingButton.vue'
import DeleteButton from '../../controls/DeleteButton.vue'
import EditButton from '../../controls/EditButton.vue'
import CancelButton from '../../controls/CancelButton.vue'
import SaveButton from '../../controls/SaveButton.vue'
import CheckBoxField from '../../fields/CheckBoxField.vue'

const SYSTEM_FIELDS = ['id', 'type', 'readonly']

export default {
  name: 'HookView',
  props: {
    hookProp: Object,
    observable: Object,
    template: Object
  },
  inject: ['device', 'gateway'],
  components: {
    InputField,
    ComboBoxField,
    LoadingButton,
    DeleteButton,
    EditButton,
    CancelButton,
    SaveButton,
    CheckBoxField
  },
  data() {
    return {
      hook: this.hookProp,
      editing: this.hookProp.id == NEW_HOOK_ID,
      haveChanges: this.hookProp.id == NEW_HOOK_ID,
      validationFailed: [],
      loading: false
    }
  },
  computed: {
    visibleFields() {
      return Object.entries(this.hook)
        .filter(([key]) => !this.isDefaultField(key))
        .reverse()
    },
    fieldsComponents() {
      return this.visibleFields.map(([field, value]) => {
        const { required } = this.template[field] || false
        return {
          key: field,
          label: this.systemNameToNormal(field),
          required,
          value,
          render: this.getFieldComponent(field)
        }
      })
    }
  },
  methods: {
    systemNameToNormal,
    isDefaultField(key) {
      return SYSTEM_FIELDS.includes(key)
    },
    isFieldDisabled(key) {
      if (!this.editing || this.isDefaultField(key)) {
        return true
      }
      return !(key in this.template)
    },
    getFieldComponent(field) {
      if (this.template[field] && this.template[field]['values']) {
        return h(ComboBoxField, { items: this.template[field]['values'] })
      }
      if (this.template[field] && this.template[field].type === 'boolean') {
        return h(CheckBoxField, {})
      }
      return h(InputField, {})
    },
    async saveHook() {
      if (!this.haveChanges) {
        console.warn('No changes were made')
        this.editing = false
        return
      }
      if (!this.validate()) {
        console.error('Validation failed: ' + this.validationFailed)
        toast.error({
          caption: 'Validation failed',
          description: `This fields cannot be empty: ${this.validationFailed}`
        })
        return
      }
      let saveFunc = async () => {}
      this.loading = true
      try {
        if (this.hook.id !== NEW_HOOK_ID) {
          saveFunc = DeviceApi.updateHook
        } else {
          delete this.hook.id
          saveFunc = DeviceApi.createHook
        }
        if (await saveFunc(this.device, this.observable, this.hook, this.gateway)) {
          console.info('Hook was saved')
          this.$emit('update')
          this.editing = false
          this.haveChanges = false
        }
      } finally {
        this.loading = false
      }
    },
    async deleteHook() {
      if (this.hook.id !== 0 && !this.hook.id) {
        console.error('Hook id is missing')
        return
      }
      if (confirm('Are you sure you wan to delete hook ' + this.hook.id + '?')) {
        this.loading = true
        try {
          if (
            await DeviceApi.deleteHook(
              this.device,
              this.observable,
              this.hook.id,
              this.gateway
            )
          ) {
            this.$emit('update')
          }
        } finally {
          this.loading = false
        }
      }
    },
    cancel() {
      this.validationFailed = []
      this.editing = false
      this.$emit('reloadHook', this.hook)
    },
    validate() {
      this.validationFailed = []
      Object.entries(this.template).forEach(([key, { required }]) => {
        if (required) {
          const value = this.hook[key]
          if (value == null || value == undefined || value === '') {
            this.validationFailed.push(key)
          }
        }
      })
      return this.validationFailed.length == 0
    },
    setValue(key, value) {
      if (!key) {
        console.error('Key is missing')
        return
      }
      let finalValue = value
      const type = this.template[key]['type']
      if (type) {
        switch (type) {
          case 'boolean':
            finalValue = value == 'true'
            break
          case 'integer':
          case 'number':
            finalValue = Number.parseInt(value)
            break
          case 'string':
          case 'text':
            finalValue = value
            break
          default:
            console.error('Type ' + type + ' not supported yet')
        }
      }
      this.hook[key] = finalValue
      this.haveChanges = true
    }
  }
}
</script>

<template>
  <div class="bordered" style="padding: var(--padding-default)">
    <div class="header">
      <h3 class="title" style="flex: 1 1 auto; text-align: start">
        [{{ hook.id }}] {{ hook.caption || systemNameToNormal(hook.type) }}
      </h3>
      <div class="controls">
        <div v-if="!hook.readonly" class="hook-view-controls">
          <DeleteButton v-if="!editing" :onClick="deleteHook" :loading="loading" />
          <CancelButton v-if="editing" :onClick="cancel" />
          <EditButton v-if="!editing" :onClick="() => (editing = true)" />
          <SaveButton v-if="editing" :onClick="saveHook" :loading="loading" />
        </div>
        <div v-else>
          <h3 style="text-align: center">Readonly</h3>
        </div>
      </div>
    </div>
    <div class="list">
      <InputField label="type" :modelValue="hook.type" :disabled="true" />
      <component
        v-for="{ key, label, value, render, required } in fieldsComponents"
        :is="render"
        :key="key"
        :label="label"
        :modelValue="value"
        :notBlank="required"
        :disabled="isFieldDisabled(key)"
        :validationFailed="validationFailed.includes(key)"
        @update:modelValue="(value) => setValue(key, value)"
      />
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  flex-direction: row;
  gap: var(--default-gap);
  position: relative;
}

.controls {
  display: flex;
  flex-direction: row;
  padding-top: var(--default-gap);
  gap: var(--default-gap);
}

.controls * {
  flex: 1 1 auto;
}

.hook-view-controls {
  display: flex;
  flex-direction: row-reverse;
  column-gap: var(--default-gap);
  margin-bottom: 5px;
}
</style>
