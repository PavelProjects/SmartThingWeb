<script>
import DevicesSearchView from './DevicesSearchView.vue'
import DeviceControlPanel from './DeviceControlPanel.vue'
import { h } from 'vue'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel
  },
  props: {
    gateway: Object
  },
  data() {
    return {
      tabs: {},
      selected: undefined
    }
  },
  methods: {
    handleDeviceSwitch(deviceInfo) {
      const { ip } = deviceInfo || {}
      if (!ip) {
        console.log(`Failed to get ip from ${deviceInfo}`)
        return
      }
      if (!this.tabs[ip]) {
        this.tabs[ip] = h(DeviceControlPanel, {
          key: ip,
          device: deviceInfo,
          gateway: this.gateway
        })
      }
      this.selected = ip
    }
  }
}
</script>

<template>
  <div class="devices-table">
    <DevicesSearchView :gateway="gateway" @select="handleDeviceSwitch" />
    <div v-if="selected">
      <h1 class="title">Control panel</h1>
      <KeepAlive>
        <component :is="tabs[selected]"></component>
      </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
.devices-table {
  display: flex;
  flex-direction: row;
  gap: var(--default-gap);
}
</style>
