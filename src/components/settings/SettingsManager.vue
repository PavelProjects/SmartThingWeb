<script>
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { useIntl } from 'vue-intl'
import { toast } from '../../utils/EventBus'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import MenuItem from '../menu/MenuItem.vue'
import InputField from '../base/fields/InputField.vue'
import { DeviceApi } from '../../api/device/DeviceApi'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import { extractDataFromError } from '../../api/ApiUtils'

const MODE = {
  EXPORT: 'export',
  IMPORT: 'import'
}

export default {
  name: 'SettingsManager',
  components: {
    LoadingButton,
    BaseContainer,
    MenuItem,
    InputField,
    DevicesSearchView,
    PopUpDialog
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      selectedSettings: undefined,
      savedSettings: [],
      selectedDevice: undefined,
      mode: undefined
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    async loadSettings() {
      this.loading = true
      try {
        this.savedSettings = await GatewayApi.getDevicesSettings(this.gateway)
        this.loading = false
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load saved device settings'
        })
      }
    },
    addNew() {
      this.selectedSettings = {
        name: 'New settings',
        value: ''
      }
    },
    validate() {
      let valid = true
      if (this.selectedSettings.name.length === 0) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.settings.editor.name.empty' }),
          description: this.intl.formatMessage({ id: 'device.settings.editor.name.empty.desc' })
        })
        valid = false
      }
      if (this.selectedSettings.value.length === 0) {
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
        if (this.selectedSettings.id) {
          this.selectedSettings = await GatewayApi.updateDeviceSettings(
            this.selectedSettings,
            this.gateway
          )
          toast.success({
            caption: this.intl.formatMessage({ id: 'device.settings.editor.updated' })
          })
        } else {
          this.selectedSettings = await GatewayApi.createDeviceSettings(
            this.selectedSettings,
            this.gateway
          )
          toast.success({
            caption: this.intl.formatMessage({ id: 'device.settings.editor.created' })
          })
        }
        this.loadSettings()
      } catch (error) {
        const { message: description } = await extractDataFromError(error)
        toast.error({
          caption: 'device.settings.editor.error',
          description
        })
      } finally {
        this.loading = false
      }
    },
    async deleteSettings() {
      if (!confirm(this.intl.formatMessage({ id: 'device.settings.editor.delete.confirm' }))) {
        return
      }
      try {
        await GatewayApi.deleteDeviceSettings(this.selectedSettings.id, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.settings.editor.delete.success' })
        })
        this.loadSettings()
        this.selectedSettings = undefined
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
      if (!deviceInfo || !deviceInfo[0]) {
        return
      }
      this.selectedDevice = deviceInfo[0]
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
        this.selectedSettings.value = JSON.stringify(loadedSettings, null, 2)
        this.selectedSettings.name = `${this.selectedDevice.name}_${!!this.selectedDevice.type && this.selectedDevice.type}`
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
        settings = JSON.parse(this.selectedSettings.value)
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
  <BaseContainer :vertical="true">
    <h1 class="title">{{ intl.formatMessage({ id: 'device.settings.manager.menu.header' }) }}</h1>
    <BaseContainer class="bordered settings-manager">
      <BaseContainer class="items" :vertical="true">
        <MenuItem
          v-for="(settings, index) of savedSettings"
          :key="index"
          :caption="settings.name"
          :selected="selectedSettings == settings"
          @select="() => (selectedSettings = settings)"
        />
        <LoadingButton @click="() => addNew()">
          <h2>
            {{ intl.formatMessage({ id: 'device.settings.manager.add' }) }}
          </h2>
        </LoadingButton>
      </BaseContainer>
      <BaseContainer v-if="!!selectedSettings" class="settings-editor" :vertical="true">
        <InputField
          :label="intl.formatMessage({ id: 'device.settings.editor.name' })"
          v-model="selectedSettings.name"
        />
        <h2 class="title">
          {{ intl.formatMessage({ id: 'device.settings.editor.title' }) }}
        </h2>
        <textarea class="editor" v-model="selectedSettings.value"></textarea>
        <BaseContainer class="controls">
          <LoadingButton @click="save" :loading="loading">
            <h2>
              {{
                intl.formatMessage(
                  { id: 'device.settings.editor.button' },
                  { action: !!selectedSettings.id ? 'update' : 'create' }
                )
              }}
            </h2>
          </LoadingButton>
          <LoadingButton v-if="selectedSettings.id" @click="deleteSettings" class="delete">
            <h2>
              {{
                intl.formatMessage({ id: 'device.settings.editor.button' }, { action: 'delete' })
              }}
            </h2>
          </LoadingButton>
        </BaseContainer>
        <BaseContainer class="controls">
          <button v-if="!!selectedSettings.id" class="btn" @click="handleExportBtn">
            <h2>
              {{
                intl.formatMessage({ id: 'device.settings.editor.button' }, { action: 'export' })
              }}
            </h2>
          </button>
          <button v-else class="btn" @click="handleImportBtn">
            <h2>
              {{
                intl.formatMessage({ id: 'device.settings.editor.button' }, { action: 'import' })
              }}
            </h2>
          </button>
        </BaseContainer>
      </BaseContainer>
      <PopUpDialog v-if="mode" @close="mode = undefined">
        <DevicesSearchView
          :title="intl.formatMessage({ id: 'device.settings.editor.select.device' })"
          v-on:update:model-value="handleDeviceClick"
        />
      </PopUpDialog>
    </BaseContainer>
  </BaseContainer>
</template>

<style scoped>
.settings-manager {
  width: fit-content;
  margin: 0 auto;
}
.items {
  padding: var(--default-gap);
  border-right: 2px solid var(--color-border);
}
.items:last-child {
  border-right: none;
}
.settings-editor {
  width: 50vw;
  max-width: 800px;
  min-width: 500px;
  padding: var(--default-padding);
}
.settings-editor textarea {
  resize: none;
  font-size: 14px;
}
.editor {
  font-size: 20px;
  min-height: 400px;
}
.delete {
  background-color: var(--color-danger);
}
.controls button {
  flex: 1 0 auto;
}
.device-item:hover {
  transition: background-color 0.5s;
  background-color: var(--color-background-mute);
}
</style>
