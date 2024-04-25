<script>
import { GatewayApi } from '../../../api/gateway/GatewayApi'
import SettingsEditor from './SettingsEditor.vue'
import MenuView from '../../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus'
import { storeToRefs } from 'pinia'
import { useGatewayStore } from '../../../store/gatewayStore'

export default {
  name: 'SettingsManager',
  components: {
    MenuView
  },
  data() {
    const { gateway } = storeToRefs(useGatewayStore())
    const intl = useIntl()
    return {
      intl,
      gateway,
      loading: false,
      selected: undefined,
      tabs: {},
      openTab: undefined
    }
  },
  watch: {
    gateway() {
      this.loadSettings()
    }
  },
  methods: {
    async loadSettings() {
      this.loading = true
      try {
        const settings = await GatewayApi.getDevicesSettings(this.gateway)
        if (settings) {
          this.tabs = settings.reduce((acc, settings) => {
            acc[settings.name] = {
              class: SettingsEditor,
              caption: settings.name,
              props: {
                settings
              }
            }
            return acc
          }, {})
        }
        this.tabs['new'] = {
          class: SettingsEditor,
          caption: this.intl.formatMessage({ id: 'device.settings.manager.add' }),
          props: {
            settings: {}
          }
        }
        this.loading = false
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load saved device settings'
        })
      }
    },
    async handleChange(name) {
      await this.loadSettings()
      this.openTab = name
    }
  }
}
</script>

<template>
  <div class="container">
    <MenuView
      :header="intl.formatMessage({ id: 'device.settings.manager.menu.header' })"
      :tabs="tabs"
      :tab="openTab"
      @changed="(event) => handleChange(event)"
    />
  </div>
</template>

<style scoped>
.container {
  width: fit-content;
  margin: 0 auto;
}
</style>
