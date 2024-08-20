<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { useIntl } from 'vue-intl'
import DropdownMenu from './menu/DropdownMenu.vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel,
    DropdownMenu,
    RiseLoader
  },
  inject: ['gateway', 'mode'],
  data() {
    const intl = useIntl()
    return {
      windowWidth: window.innerWidth,
      searchExpanded: true,
      device: undefined,
      intl
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.onResize)
    })
  },
  unmounted() {
    window.removeEventListener('resize', this.onResize)
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
    async handleDeviceSelect(selected) {
      if (this.device === selected) {
        return
      }
      this.device = selected
    }
  }
}
</script>

<template>
  <div class="devices-table">
    <div v-if="mode === 'gateway' || !!gateway">
      <DevicesSearchView
        v-if="wideEnough"
        class="search"
        :gateway="gateway"
        :selected="device"
        @select="handleDeviceSelect"
      />
      <DropdownMenu
        v-else
        class="search"
        :placeholder="intl.formatMessage({ id: 'gateway.panel.devices' })"
        :vertical="false"
        :expanded="searchExpanded"
        @expand="(v) => (searchExpanded = v)"
      >
        <DevicesSearchView :gateway="gateway" :selected="device" @select="handleDeviceSelect" />
      </DropdownMenu>
      <DeviceControlPanel
        v-if="device"
        :key="device.ip"
        :device="device"
      />
    </div>
    <div v-else style="color: red; text-align: center">
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
.rise-loader {
  padding-top: 40px;
}
</style>
