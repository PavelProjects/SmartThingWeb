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
      settings: [],
      selected: undefined,
      tabs: {},
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    async loadSettings() {
      this.loading = true
      this.devicesSettings = await GatewayApi.getDevicesSettings()
      if (this.devicesSettings) {
        this.tabs = this.devicesSettings.reduce((acc, {name, settings}) => {
          acc[name] = {
            class: SettingsEditor,
            caption: name,
            props: {
              name,
              settings
            }
          }
          return acc
        }, {});
      }
      this.tabs["new"] = {
        class: SettingsEditor,
        caption: "Add new",
      }
      this.loading = false
    }
  }
}
</script>

<template>
  <div>
    <MenuView
      header="Saved settings"
      :tabs="tabs"
      :updateTabs="() => loadSettings()"
    />
  </div>
</template>

<style scoped>
  .update {
    position: absolute;
    right: 0px;
    top: 5px;
  }
</style>