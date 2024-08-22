<script>
import { systemNameToNormal } from '../../../utils/StringUtils.js'
import InputField from '../../fields/InputField.vue'
import ComboBoxField from '../../fields/ComboBoxField.vue'
import { DeviceApi, DeviceApiMethods, extractDataFromError } from '../../../api/device/DeviceApi.js'
import { NEW_HOOK_ID } from './HooksView.vue'
import { h } from 'vue'
import { toast } from '../../../utils/EventBus.js'
import LoadingButton from '../../controls/LoadingButton.vue'
import CheckBoxField from '../../fields/CheckBoxField.vue'
import DeleteSVG from 'vue-material-design-icons/Delete.vue'
import SaveSVG from 'vue-material-design-icons/ContentSave.vue'
import CancelSVG from 'vue-material-design-icons/WindowClose.vue'
import EditSVG from 'vue-material-design-icons/Pencil.vue'
import TestTubeSvg from 'vue-material-design-icons/TestTube.vue'
import { useIntl } from 'vue-intl'
import Container from '../../base/Container.vue'
import ContextMenu from '../../menu/ContextMenu.vue'
import PopUpDialog from '../../dialogs/PopUpDialog.vue'
import ChevronDown from 'vue-material-design-icons/ChevronDown.vue'
import ChevronUp from 'vue-material-design-icons/ChevronUp.vue'

const SYSTEM_FIELDS = ['id', 'type', 'readonly']

//todo fields names select from messages in intl

export default {
  name: 'HookView',
  props: {
    hookProp: Object,
    observable: Object,
    template: Object
  },
  inject: ['device', 'gateway', 'apiMethods'],
  emits: ['updateHooks', 'removeHook'],
  components: {
    InputField,
    ComboBoxField,
    LoadingButton,
    CheckBoxField,
    Container,
    ContextMenu,
    DeleteSVG,
    SaveSVG,
    CancelSVG,
    EditSVG,
    TestTubeSvg,
    PopUpDialog,
    ChevronDown,
    ChevronUp
  },
  data() {
    const intl = useIntl()
    const testEnabled = !!this.apiMethods.find(({ name }) => name === DeviceApiMethods.TEST_HOOK)
    return {
      intl,
      testEnabled,
      hook: this.hookProp,
      editing: this.hookProp.id == NEW_HOOK_ID,
      haveChanges: this.hookProp.id == NEW_HOOK_ID,
      validationFailed: [],
      expanded: false,
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
        this.$emit('updateHooks')
        this.editing = false
        this.haveChanges = false
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
          this.$emit('updateHooks')
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
      this.haveChanges = true
    }
  }
}
</script>

<template>
  <Container class="hook" :vertical="true">
    <Container>
      <ChevronUp v-if="expanded" @click.stop="() => (expanded = false)" />
      <ChevronDown v-else @click.stop="() => (expanded = true)" />
      <h3 class="title" style="flex: 1 1 auto; text-align: start">
        [{{ hook.id }}] {{ hook.caption || systemNameToNormal(hook.type) }}
      </h3>
      <Container>
        <Container v-if="!hook.readonly">
          <Container v-if="editing">
            <SaveSVG class="icon" :onClick="saveHook" :loading="loading" />
            <CancelSVG class="icon" :onClick="cancel" />
          </Container>
          <Container v-else>
            <EditSVG class="icon" :onClick="() => (editing = true)" />
            <DeleteSVG class="icon" :onClick="deleteHook" :loading="loading" />
            <TestTubeSvg
              v-if="testEnabled && !editing"
              class="icon"
              :title="intl.formatMessage({ id: 'device.hook.test.it' })"
              @click="() => (testDialogVisible = true)"
            />
          </Container>
        </Container>
        <div v-else>
          <h3 style="text-align: center">
            {{ intl.formatMessage({ id: 'device.hook.readonly' }) }}
          </h3>
        </div>
      </Container>
    </Container>
    <Container v-if="expanded" :vertical="true">
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
    </Container>
    <PopUpDialog v-if="testDialogVisible" @close="testDialogVisible = false">
      <Container :vertical="true" style="padding: var(--default-gap)">
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
      </Container>
    </PopUpDialog>
  </Container>
</template>

<style scoped>
.hook {
  padding: var(--default-gap);
}
.icon {
  cursor: pointer;
}
</style>
