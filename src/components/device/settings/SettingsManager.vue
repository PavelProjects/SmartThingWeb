<script>
import { GatewayApi } from '../../../api/GatewayApi'
import UpdateButton from '../../controls/UpdateButton.vue'
import SettingsEditor from './SettingsEditor.vue'
import MenuView from '../../menu/MenuView.vue'

export default {
  name: "SettingsManager",
  components: {
    UpdateButton,
    MenuView,
  },
  data() {
    return {
      loading: false,
      selected: undefined,
      tabs: {},
      openTab: undefined,
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
        }, {});
      }
      this.tabs["new"] = {
        class: SettingsEditor,
        caption: "Add new",
        props: {
          settings: {}
        }
      }
      this.loading = false
    },
    async handleChange(name) {
      await this.loadSettings();
      this.openTab = name
    },
  }
}
</script>

<template>
  <MenuView
    header="Saved devices settings"
    :tabs="tabs"
    :tab="openTab"
    @onUpdate="(event) => handleChange(event)"
  />
</template>