<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { useGatewayStore } from '../store/gatewayStore'
import { storeToRefs } from 'pinia'
import { useIntl } from 'vue-intl'
import GatewaySelector from './gateway/GatewaySelector.vue'
import DropdownMenu from './menu/DropdownMenu.vue'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel,
    GatewaySelector,
    DropdownMenu,
  },
  data() {
    const { gateway, device } = storeToRefs(useGatewayStore())
    const intl = useIntl()
    return {
      mode: import.meta.env.VITE_MODE,
      searchExpanded: !device,
      windowWidth: window.innerWidth,
      gateway,
      device,
      intl,
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  unmounted() { 
    window.removeEventListener('resize', this.onResize); 
  },
  computed: {
    wideEnough() {
      return (this.windowWidth - 800) / 2 > 350
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    handleDeviceSelect(selected) {
      if (this.device === selected) {
        return
      }
      this.device = selected
      this.searchExpanded = false
    }
  }
  // todo select device from path
}
</script>

<template>
  <div class="devices-table">
    <div v-if="mode === 'gateway' || !!gateway">
      <DevicesSearchView
        v-if="wideEnough"
        class="search bordered"
        :gateway="gateway"
        :selected="device"
        @select="handleDeviceSelect"
      />
      <DropdownMenu
        v-else
        class="search"
        placeholder="Devices"
        :vertical="false"
        :expanded="searchExpanded"
        @expand="(v) => searchExpanded = v"
      >
        <DevicesSearchView
          class="bordered"
          :gateway="gateway"
          :selected="device"
          @select="handleDeviceSelect"
        />
      </DropdownMenu>
      <div v-if="device">
        <h1 class="title">{{ intl.formatMessage({ id: 'gateway.panel' }, {device: device.name}) }}</h1>
        <KeepAlive>
          <Suspense>
            <DeviceControlPanel :key="device.ip" :device="device" :gateway="gateway"/>
          </Suspense>
        </KeepAlive>
      </div>
    </div>
    <div v-else style="color: red; text-align: center;">
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
}
</style>
