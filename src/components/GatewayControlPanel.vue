<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { h } from 'vue'
import { CloudApi } from '../api/CloudApi'
import { useControlPanelStore } from '../store/controlPanelStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel
  },
  data() {
    const { gateway, device } = storeToRefs(useControlPanelStore())
    return {
      gateway,
      device,
      gatewayId: this.$route.params.gateway,
    }
  },
  async mounted() {
    if (!this.gateway && this.gatewayId && import.meta.env.VITE_MODE === 'cloud') {
      this.gateway = await CloudApi.getGateway(this.gatewayId);
    }
  },
}
</script>

<template>
  <div class="list">
    <div class="devices-table">
      <div v-if="!gatewayId || gateway">
        <DevicesSearchView 
          class="search"
          :gateway="gateway"
          @select="(deviceInfo) => device = deviceInfo"
        />
        <div v-if="device">
          <h1 class="title">Control panel</h1>
          <KeepAlive>
            <DeviceControlPanel :key="device.ip" />
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
