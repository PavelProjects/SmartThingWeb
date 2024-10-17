<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { useIntl } from 'vue-intl'
import DropdownMenu from './menu/DropdownMenu.vue'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel,
    DropdownMenu
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
  watch: {
    device() {
      this.searchExpanded = this.wideEnough
    }
  },
  methods: {
    onResize() {
      this.windowWidth = window.innerWidth
    },
    handleDeviceDelete(ip) {
      if (this.device.ip === ip) {
        this.device = undefined
        this.searchExpanded = true
      }
    }
  }
}
</script>

<template>
  <div class="devices-table">
    <div v-if="mode === 'gateway' || !!gateway">
      <DropdownMenu
        class="search"
        :placeholder="intl.formatMessage({ id: 'gateway.panel.devices' })"
        :vertical="false"
        :expanded="searchExpanded || !device"
        @expand="(v) => (searchExpanded = v)"
      >
        <DevicesSearchView
          v-model="device"
          @deviceDeleted="handleDeviceDelete"
        />
      </DropdownMenu>
      <DeviceControlPanel v-if="device && device[0]" :key="device[0].ip" :device="device[0]" />
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
.device-item:hover {
  transition: background-color 0.5s;
  background-color: var(--color-background-mute);
}
</style>
