<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { CloudApi } from '../api/CloudApi'
import { useControlPanelStore } from '../store/controlPanelStore'
import { storeToRefs } from 'pinia'
import { useIntl } from 'vue-intl'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel
  },
  data() {
    const { gateway, device } = storeToRefs(useControlPanelStore())
    const intl = useIntl();
    return {
      gateway,
      device,
      intl,
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
          <h1 class="title">{{ intl.formatMessage({ id: 'gateway.panel' }) }}</h1>
          <KeepAlive>
            <DeviceControlPanel :key="device.ip" />
          </KeepAlive>
        </div>
      </div>
      <div v-else style="color: red">
        <h1>{{ intl.formatMessage({ 'id': 'error' }, { 'type': 'access_denied' }) }}</h1>
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
