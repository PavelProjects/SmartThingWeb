<script>
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../controls/LoadingButton.vue'
import InputField from '../fields/InputField.vue'
import { DeviceApi, extractDataFromError } from '../../api/device/DeviceApi'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import { useIntl } from 'vue-intl'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import Container from '../base/Container.vue'

const MODE = {
  EXPORT: 'export',
  IMPORT: 'import'
}

export default {
  name: 'SettingsEditor',
  components: {
    InputField,
    LoadingButton,
    DevicesSearchView,
    PopUpDialog,
    Container
  },
  props: {
    settings: {
      type: Object
    }
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    const { name, value } = this.settings
    return {
      intl,
      newSettings: { name, value },
      loading: false,
      loadingDevices: false,
      devices: [],
      selectedDevice: undefined,
      mode: undefined
    }
  },
  methods: {
    validate() {
      let valid = true
      if (this.newSettings.name.length === 0) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.settings.editor.name.empty' }),
          description: this.intl.formatMessage({ id: 'device.settings.editor.name.empty.desc' })
        })
        valid = false
      }
      if (this.newSettings.value.length === 0) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.settings.editor.setting.empty' }),
          description: this.intl.formatMessage({ id: 'device.settings.editor.setting.empty.desc' })
        })
        valid = false
      }
      return valid
    },
    async save() {
      if (!this.validate()) {
        return
      }
      this.loading = true
      try {
        if (this.settings.name) {
          const payload = {
            oldName: this.settings.name,
            ...this.newSettings
          }

          try {
            await GatewayApi.updateDeviceSettings(payload, this.gateway)
            toast.success({
              caption: this.intl.formatMessage({ id: 'device.settings.editor.updated' })
            })
            this.$emit('changed', this.newSettings.name)
          } catch (error) {
            console.error(error)
            const { message: description } = await extractDataFromError(error)
            toast.error({
              caption: 'Failed to update device settings',
              description
            })
          }
        } else {
          try {
            await GatewayApi.createDeviceSettings(this.newSettings, this.gateway)
            toast.success({
              caption: this.intl.formatMessage({ id: 'device.settings.editor.created' })
            })
            this.$emit('changed', this.newSettings.name)
          } catch (error) {
            console.error(error)
            const { message: description } = await extractDataFromError(error)
            toast.error({
              caption: 'Failed to create device settings',
              description
            })
          }
        }
      } finally {
        this.loading = false
      }
    },
    async deleteSettings() {
      if (!confirm(this.intl.formatMessage({ id: 'device.settings.editor.delete.confirm' }))) {
        return
      }
      try {
        await GatewayApi.deleteDeviceSettings(this.settings.name, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.settings.editor.delete.success' })
        })
        this.$emit('changed')
      } catch (error) {
        console.error(error)
        const { message: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to delete device settings',
          description
        })
      }
    },
    async handleDeviceClick(deviceInfo) {
      this.selectedDevice = deviceInfo
      this.loading = true
      try {
        if (this.mode === MODE.IMPORT) {
          await this.importFrom()
        } else if (this.mode === MODE.EXPORT) {
          await this.exportTo()
        }
      } finally {
        this.loading = false
        this.selectedDevice = undefined
        this.mode = undefined
      }
    },
    async importFrom() {
      try {
        const loadedSettings =
          (await DeviceApi.exportSettings(this.selectedDevice, this.gateway)) || {}
        this.newSettings.value = JSON.stringify(loadedSettings, null, 2)
        this.newSettings.name = `${this.selectedDevice.name}_${!!this.selectedDevice.type && this.selectedDevice.type}`
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to export device settings',
          description
        })
      }
    },
    async exportTo() {
      let settings = {}
      try {
        settings = JSON.parse(this.newSettings.value)
      } catch (error) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.settings.editor.json.parse.error' }),
          description: error
        })
        return
      }

      await this.save()
      this.loading = true
      try {
        await DeviceApi.importSettings(this.selectedDevice, this.gateway, settings)
        toast.success({
          caption: this.intl.formatMessage(
            { id: 'device.settings.editor.export.success' },
            { name: this.selectedDevice.name }
          ),
          description: this.intl.formatMessage({ id: 'device.settings.editor.export.success.desc' })
        })
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to import settings',
          description
        })
      } finally {
        this.loading = false
      }
    },
    handleExportBtn() {
      this.mode = MODE.EXPORT
    },
    handleImportBtn() {
      this.mode = MODE.IMPORT
    }
  }
}
</script>

<template>
  <div style="padding: 5px">
    <Container class="settings-editor" :vertical="true">
      <InputField
        :label="intl.formatMessage({ id: 'device.settings.editor.name' })"
        v-model="newSettings.name"
      />
      <h2 class="title">
        {{ intl.formatMessage({ id: 'device.settings.editor.title' }) }}
      </h2>
      <textarea class="editor" v-model="newSettings.value"></textarea>
      <Container class="controls">
        <LoadingButton @click="save" :loading="loading">
          <h2>
            {{
              intl.formatMessage(
                { id: 'device.settings.editor.button' },
                { action: settings.name ? 'update' : 'create' }
              )
            }}
          </h2>
        </LoadingButton>
        <LoadingButton v-if="settings.name" @click="deleteSettings" class="delete">
          <h2>
            {{ intl.formatMessage({ id: 'device.settings.editor.button' }, { action: 'delete' }) }}
          </h2>
        </LoadingButton>
      </Container>
      <Container class="controls">
        <button v-if="settings.name" class="btn" @click="handleExportBtn">
          <h2>
            {{ intl.formatMessage({ id: 'device.settings.editor.button' }, { action: 'export' }) }}
          </h2>
        </button>
        <button v-else class="btn" @click="handleImportBtn">
          <h2>
            {{ intl.formatMessage({ id: 'device.settings.editor.button' }, { action: 'import' }) }}
          </h2>
        </button>
      </Container>
    </Container>
    <PopUpDialog v-if="mode" @close="mode = undefined">
      <DevicesSearchView
        :title="intl.formatMessage({ id: 'device.settings.editor.select.device' })"
        @select="handleDeviceClick"
      />
    </PopUpDialog>
  </div>
</template>

<style scoped>
.settings-editor {
  width: 50vw;
  padding: var(--default-padding);
}
.settings-editor textarea {
  resize: none;
}
.editor {
  font-size: 20px;
  min-height: 400px;
}
.delete {
  background-color: var(--color-danger);
}
/* todo replace with stretch */
.controls button {
  flex: 1 0 auto;
}
</style>
