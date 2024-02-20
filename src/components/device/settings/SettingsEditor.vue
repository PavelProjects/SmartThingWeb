<script>
import { GatewayApi } from '../../../api/GatewayApi'
import { toast } from '../../../utils/EventBus'
import LoadingButton from '../../controls/LoadingButton.vue'
import InputField from '../../fields/InputField.vue'
import { DeviceApi } from '../../../api/device/DeviceApi'
import DevicesSearchView from '../DevicesSearchView.vue'

const MODE = {
  EXPORT: 'export',
  IMPORT: 'import'
}

export default {
  name: 'SettingsEditor',
  components: {
    InputField,
    LoadingButton,
    DevicesSearchView
  },
  props: {
    settings: {
      type: Object
    }
  },
  data() {
    const { name, value } = this.settings
    return {
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
          caption: "Name can't be empty!",
          description: 'Insert settings name'
        })
        valid = false
      }
      if (this.newSettings.value.length === 0) {
        toast.error({
          caption: "Settings can't be empty!",
          description: 'Insert settings json'
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
          if (await GatewayApi.updateDeviceSettings(payload)) {
            toast.success({ caption: 'Settings updated!' })
            this.$emit('changed', this.newSettings.name)
          }
        } else {
          if (await GatewayApi.createDeviceSettings(this.newSettings)) {
            toast.success({ caption: 'Settings created!' })
            this.$emit('changed', this.newSettings.name)
          }
        }
      } finally {
        this.loading = false
      }
    },
    async deleteSettings() {
      if (!confirm('This action will delete saved settings permanently. Are you sure?')) {
        return
      }
      if (await GatewayApi.deleteDeviceSettings(this.settings.name)) {
        toast.success({ caption: 'Settings deleted' })
        this.$emit('changed')
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
      const loadedSettings = (await DeviceApi.exportSettings(this.selectedDevice, {})) || {}
      this.newSettings.value = JSON.stringify(loadedSettings, null, 2)
      this.newSettings.name = `${this.selectedDevice.name}_${!!this.selectedDevice.type && this.selectedDevice.type}`
    },
    async exportTo() {
      let settings = {}
      try {
        settings = JSON.parse(this.newSettings.value)
      } catch (error) {
        toast.error({
          caption: "Json parsing failed!",
          description: error
        })
        return
      }
      
      await this.save()
      this.loading = true
      if (
        await DeviceApi.importSettings(this.selectedDevice, {}, settings)
      ) {
        toast.success({
          caption: 'Export to ' + this.selectedDevice.name + ' finished!',
          description: 'Device will restart now'
        })
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
  <div class="container bordered">
    <div class="list">
      <InputField
        label="Name"
        :value="newSettings.name"
        @input="newSettings.name = $event.target.value"
      />
      <h2 class="title">Settings</h2>
      <textarea class="editor" v-model="newSettings.value"></textarea>
      <div class="controls">
        <LoadingButton @click="save" :loading="loading">
          <h2>{{ settings.name ? 'Update' : 'Create' }}</h2>
        </LoadingButton>
        <LoadingButton v-if="settings.name" @click="deleteSettings" class="delete">
          <h2>Delete</h2>
        </LoadingButton>
      </div>
      <div class="controls">
        <button v-if="settings.name" class="btn" @click="handleExportBtn">
          <h2>Export to device</h2>
        </button>
        <button v-else class="btn" @click="handleImportBtn">
          <h2>Import from device</h2>
        </button>
      </div>
    </div>
    <DevicesSearchView v-if="mode" title="Select device" @select="handleDeviceClick" />
  </div>
</template>

<style scoped>
.container {
  width: 500px;
  padding: var(--padding-default);
}
.editor {
  font-size: 20px;
  min-height: 400px;
}
.delete {
  background-color: var(--color-danger);
}
.controls {
  display: flex;
  flex-direction: row;
  gap: var(--default-gap);
}
.controls button {
  flex: 1 0 auto;
}
</style>
