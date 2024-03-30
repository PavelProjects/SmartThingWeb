<script>
import { GatewayApi } from '../../../api/GatewayApi'
import SettingsEditor from './SettingsEditor.vue'
import MenuView from '../../menu/MenuView.vue'
import { useIntl } from 'vue-intl'

export default {
  name: 'SettingsManager',
  components: {
    MenuView
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      selected: undefined,
      tabs: {},
      openTab: undefined
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    async loadSettings() {
      this.loading = true
      const settings = await GatewayApi.getDevicesSettings()
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
