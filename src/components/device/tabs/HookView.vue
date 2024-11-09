<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import InputField from '../../base/fields/InputField.vue'
import ComboBoxField from '../../base/fields/ComboBoxField.vue'
import { DeviceApi, DeviceApiMethods } from '../../../api/device/DeviceApi.js'
import { NEW_HOOK_ID } from './HooksTab.vue'
import { h } from 'vue'
import { toast } from '../../../utils/EventBus.js'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import CheckBoxField from '../../base/fields/CheckBoxField.vue'
import DeleteSVG from 'vue-material-design-icons/Delete.vue'
import SaveSVG from 'vue-material-design-icons/ContentSave.vue'
import CancelSVG from 'vue-material-design-icons/WindowClose.vue'
import EditSVG from 'vue-material-design-icons/Pencil.vue'
import TestTubeSvg from 'vue-material-design-icons/TestTube.vue'
import { useIntl } from 'vue-intl'
import BaseContainer from '../../base/BaseContainer.vue'
import ContextMenu from '../../menu/ContextMenu.vue'
import ModalDialog from '../../base/ModalDialog.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'
import { extractDataFromError } from '../../../api/ApiUtils.js'

const SYSTEM_FIELDS = ['id', 'type', 'readonly', 'trigger', 'compareType', 'rnd', 'triggerEnabled']

//todo fields names select from messages in intl

export default {
  name: 'HookView',
  props: {
    hookProp: Object,
    observable: Object,
    template: Object,
    expand: Boolean
  },
  inject: ['device', 'gateway', 'apiMethods'],
  emits: ['hookUpdated', 'removeHook'],
  components: {
    InputField,
    ComboBoxField,
    LoadingButton,
    CheckBoxField,
    BaseContainer,
    ContextMenu,
    DeleteSVG,
    SaveSVG,
    CancelSVG,
    EditSVG,
    TestTubeSvg,
    ModalDialog,
    ChevronDown,
    ChevronUp
  },
  data() {
    const intl = useIntl()
    const testEnabled = !!this.apiMethods.find(({ name }) => name === DeviceApiMethods.TEST_HOOK)
    const newHook = this.hookProp.id == NEW_HOOK_ID

    return {
      intl,
      testEnabled,
      hook: JSON.parse(JSON.stringify(this.hookProp)),
      editing: newHook,
      validationFailed: [],
      expanded: newHook || this.expand,
      loading: false,
      testLoading: false,
      testDialogVisible: false,
      testValue: ''
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
          label: this.intl.formatMessage({ id: 'device.hook.field' }, { field }),
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
      if (this.hook === this.hookProp) {
        console.warn('No changes were made')
        this.editing = false
        return
      }
      if (!this.validate()) {
        console.error('Validation failed: ' + this.validationFailed)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.hook.validation.error' }),
          description: this.intl.formatMessage(
            { id: 'device.hook.validation.error.desc' },
            { fields: this.validationFailed }
          )
        })
        return
      }
      this.loading = true
      try {
        if (this.hook.id !== NEW_HOOK_ID) {
          await DeviceApi.updateHook(this.device, this.observable, this.hook, this.gateway)
          toast.success({
            caption: 'Hook created'
          })
        } else {
          await DeviceApi.createHook(
            this.device,
            this.observable,
            { id: undefined, ...this.hook },
            this.gateway
          )
          toast.success({
            caption: 'Hook updated'
          })
        }
        this.$emit('hookUpdated')
        this.editing = false
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to save hook',
          description
        })
      } finally {
        this.loading = false
      }
    },
    async deleteHook() {
      if (this.hook.id !== 0 && !this.hook.id) {
        console.error('Hook id is missing')
        return
      }
      if (
        confirm(this.intl.formatMessage({ id: 'device.hook.delete.confirm' }, { id: this.hook.id }))
      ) {
        this.loading = true
        try {
          await DeviceApi.deleteHook(this.device, this.observable, this.hook.id, this.gateway)
          toast.success({
            caption: 'Hook deleted'
          })
          this.$emit('hookUpdated')
        } catch (error) {
          console.error(error)
          const { error: description } = await extractDataFromError(error)
          toast.error({
            caption: `Failed to delete hook by id=${this.hook.id}`,
            description
          })
        } finally {
          this.loading = false
        }
      }
    },
    async testCall() {
      try {
        this.testLoading = true
        await DeviceApi.testHook(
          this.device,
          this.observable,
          this.hook.id,
          this.testValue,
          this.gateway
        )
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.hook.test.success' })
        })
        this.testDialogVisible = false
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.hook.test.error' })
        })
      } finally {
        this.testLoading = false
      }
    },
    cancel() {
      this.validationFailed = []
      this.editing = false
      this.hook = this.hookProp
      if (this.hook.id === NEW_HOOK_ID) {
        this.$emit('removeHook')
      }
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
    }
  }
}
</script>

<template>
  <BaseContainer class="hook" :vertical="true">
    <BaseContainer>
      <ChevronUp v-if="expanded" @click.stop="() => (expanded = false)" />
      <ChevronDown v-else @click.stop="() => (expanded = true)" />
      <h3 class="header" style="flex: 1 1 auto; text-align: start">
        [{{ hook.id }}] {{ hook.caption || systemNameToNormal(hook.type) }}
      </h3>
      <BaseContainer>
        <BaseContainer v-if="!hook.readonly">
          <BaseContainer v-if="editing">
            <SaveSVG class="icon" :onClick="saveHook" :loading="loading" />
            <CancelSVG class="icon" :onClick="cancel" />
          </BaseContainer>
          <BaseContainer v-else>
            <EditSVG class="icon" :onClick="() => (editing = true)" />
            <DeleteSVG class="icon" :onClick="deleteHook" :loading="loading" />
            <TestTubeSvg
              v-if="testEnabled && !editing"
              class="icon"
              :title="intl.formatMessage({ id: 'device.hook.test.it' })"
              @click="() => (testDialogVisible = true)"
            />
          </BaseContainer>
        </BaseContainer>
        <div v-else>
          <h3 style="text-align: center">
            {{ intl.formatMessage({ id: 'device.hook.readonly' }) }}
          </h3>
        </div>
      </BaseContainer>
    </BaseContainer>
    <BaseContainer v-if="expanded" :vertical="true">
      <InputField
        :label="this.intl.formatMessage({ id: 'device.hook.field' }, { field: 'type' })"
        :modelValue="hook.type"
        :disabled="true"
      />
      <CheckBoxField
        :label="intl.formatMessage({ id: 'device.hook.trigger.enabled' })"
        v-model="hook.triggerEnabled"
        :disabled="!this.editing"
      />
      <BaseContainer v-if="hook.triggerEnabled" :vertical="true">
        <InputField
          :label="this.intl.formatMessage({ id: 'device.hook.field' }, { field: 'trigger' })"
          v-model="hook.trigger"
          :disabled="!this.editing"
        />
        <ComboBoxField
          :label="this.intl.formatMessage({ id: 'device.hook.field' }, { field: 'compareType' })"
          v-model="hook.compareType"
          :items="template?.compareType?.values"
          :disabled="!this.editing"
        />
      </BaseContainer>
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
    </BaseContainer>
    <ModalDialog v-if="testDialogVisible" @close="testDialogVisible = false">
      <BaseContainer :vertical="true" style="padding: var(--default-padding)">
        <InputField
          :label="intl.formatMessage({ id: 'device.hook.test.label' })"
          :type="observable.type === 'sensor' ? 'number' : 'text'"
          v-model="testValue"
        />
        <LoadingButton @click="testCall" :loading="testLoading">
          <h2>
            {{ intl.formatMessage({ id: 'device.hook.test.button' }) }}
          </h2>
        </LoadingButton>
      </BaseContainer>
    </ModalDialog>
  </BaseContainer>
</template>

<style scoped>
.hook {
  padding: var(--default-padding);
}
.icon {
  cursor: pointer;
}
</style>
