<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { CloudApi } from '../api/CloudApi'
import { useGatewayStore } from '../store/gatewayStore'
import { storeToRefs } from 'pinia'
import { useIntl } from 'vue-intl'
import GatewaySelector from './gateway/GatewaySelector.vue'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel,
    GatewaySelector
  },
  data() {
    const { gateway, device } = storeToRefs(useGatewayStore())
    const intl = useIntl()
    return {
      mode: import.meta.env.VITE_MODE,
      gateway,
      device,
      intl,
    }
  },
  // todo select device from path
  // todo gateway select if gateway offline (handle logout events)
}
</script>

<template>
  <div class="devices-table">
    <div v-if="mode === 'gateway' || !!gateway">
      <DevicesSearchView
        class="search"
        :gateway="gateway"
        @select="(deviceInfo) => (device = deviceInfo)"
      />
      <div v-if="device">
        <h1 class="title">{{ intl.formatMessage({ id: 'gateway.panel' }) }}</h1>
        <KeepAlive>
          <DeviceControlPanel :key="device.ip" />
        </KeepAlive>
      </div>
    </div>
    <div v-else style="color: red">
      <h1>{{ intl.formatMessage({ id: 'error' }, { type: 'access_denied' }) }}</h1>
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
  min-width: 350px;
}
</style>
