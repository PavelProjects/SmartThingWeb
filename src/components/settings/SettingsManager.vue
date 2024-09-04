<script>
import { GatewayApi } from '../../api/gateway/GatewayApi'
import SettingsEditor from './SettingsEditor.vue'
import MenuView from '../menu/MenuView.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../utils/EventBus'

export default {
  name: 'SettingsManager',
  components: {
    MenuView
  },
  inject: ['gateway'],
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
  // todo create new impl of menu for this task
}
</script>

<template>
  <div class="container">
    <h2 class="title">{{ intl.formatMessage({ id: 'device.settings.manager.menu.header' }) }}</h2>
    <div class="bordered">
      <MenuView :tabs="tabs" :tab="openTab" @changed="handleChange" />
    </div>
  </div>
</template>

<style scoped>
.container {
  width: fit-content;
  margin: 0 auto;
  padding: 10px;
}
</style>
