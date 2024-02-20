<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { h } from 'vue'
import { CloudApi } from '../api/CloudApi'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel
  },
  data() {
    return {
      tabs: {},
      selected: undefined,
      gatewayId: this.$route.params.gateway,
      gateway: {},
    }
  },
  async mounted() {
    if (this.gatewayId && import.meta.env.VITE_MODE === 'cloud') {
      this.gateway = await CloudApi.getGateway(this.gatewayId);
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
          device: deviceInfo
        })
      }
      this.selected = ip
    }
  }
}
</script>

<template>
  <div class="list">
    <div v-if="gateway && gateway.name">
      <h1 class="title">
        Current gateway: {{ gateway.name }}
      </h1>
    </div>
    <div class="devices-table">
      <div v-if="!gatewayId || gateway">
        <DevicesSearchView class="search" @select="handleDeviceSwitch" />
        <div v-if="selected">
          <h1 class="title">Control panel</h1>
          <KeepAlive>
            <component :is="tabs[selected]"></component>
          </KeepAlive>
        </div>
      </div>
      <div v-else style="color: red">
        <h1>Access denied</h1>
      </div>
    </div>
  </div>
</template>

<style scoped>
.devices-table {
  position: relative;
}
.search {
  position: absolute;
  top: var(--default-gap);
  left: var(--default-gap);
  min-width: 300px;
}
</style>
