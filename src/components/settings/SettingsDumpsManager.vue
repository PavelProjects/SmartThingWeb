<script>
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { useIntl } from 'vue-intl'
import { toast } from '../../utils/EventBus'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import ExportFromDeviceDialog from './ExportFromDeviceDialog.vue'
import SettingsDumpItem from './SettingsDumpItem.vue'
import SettingsDumpInfoDialog from './SettingsDumpInfoDialog.vue'
import ImportToDeviceDialog from './ImportToDeviceDialog.vue'

export default {
  name: 'SettingsDumpsManager',
  components: {
    LoadingButton,
    BaseContainer,
    ExportFromDeviceDialog,
    ImportToDeviceDialog,
    SettingsDumpItem,
    SettingsDumpInfoDialog
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      savedSettings: [],
      selectedSettings: undefined,
      exportDialogVisible: false,
      importDialogVisible: false
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    async loadSettings() {
      try {
        this.savedSettings = await GatewayApi.getDevicesSettings(this.gateway)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load saved device settings'
        })
      }
    },
    async deleteSettings() {
      if (!this.selectedSettings) {
        return
      }

      if (!confirm(this.intl.formatMessage({ id: 'device.settings.delete.confirm' }))) {
        return
      }

      try {
        await GatewayApi.deleteDeviceSettings(this.selectedSettings.id, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.settings.delete.success' })
        })
        this.selectedSettings = undefined
        this.loadSettings()
      } catch (error) {
        console.log(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.settings.delete.error' })
        })
      }
    }
  }
}
</script>

<template>
  <BaseContainer :vertical="true">
    <h1 class="header">{{ intl.formatMessage({ id: 'device.settings.manager.menu.header' }) }}</h1>
    <BaseContainer class="settings-manager" :vertical="true">
      <BaseContainer v-if="savedSettings?.length" class="bordered" :vertical="true">
        <SettingsDumpItem
          v-for="settings of savedSettings"
          :key="settings.id"
          class="item"
          :settings="settings"
          @click="() => (selectedSettings = settings)"
          @importToDevice="
            () => {
              selectedSettings = settings
              importDialogVisible = true
            }
          "
          @delete="
            () => {
              selectedSettings = settings
              deleteSettings()
            }
          "
        />
      </BaseContainer>
      <h2 v-else class="header">
        {{ intl.formatMessage({ id: 'device.settings.empty' }) }}
      </h2>
      <LoadingButton class="export-button" @click="() => (exportDialogVisible = true)">
        <h3>
          {{ intl.formatMessage({ id: 'device.settings.export' }) }}
        </h3>
      </LoadingButton>
    </BaseContainer>
    <SettingsDumpInfoDialog
      :open="selectedSettings && !importDialogVisible"
      :settings="selectedSettings"
      @close="() => (selectedSettings = undefined)"
      @importToDevice="() => (importDialogVisible = true)"
      @delete="() => deleteSettings()"
    />
    <ExportFromDeviceDialog
      :open="exportDialogVisible"
      @close="
        () => {
          loadSettings()
          exportDialogVisible = false
        }
      "
    />
    <ImportToDeviceDialog
      :open="importDialogVisible"
      :settings="selectedSettings"
      @close="
        () => {
          importDialogVisible = undefined
          selectedSettings = undefined
        }
      "
    />
  </BaseContainer>
</template>

<style scoped>
.settings-manager {
  width: fit-content;
  margin: 0 auto;
}
.item {
  border-bottom: 2px solid var(--color-border);
}
.item:last-child {
  border-bottom: none;
}
</style>
