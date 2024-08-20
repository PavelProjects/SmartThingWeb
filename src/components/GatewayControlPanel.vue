<script>
import DevicesSearchView from './device/DevicesSearchView.vue'
import DeviceControlPanel from './device/DeviceControlPanel.vue'
import { useIntl } from 'vue-intl'
import DropdownMenu from './menu/DropdownMenu.vue'
import { DeviceApi } from '../api/device/DeviceApi'
import { toast } from '../utils/EventBus'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import { GatewayApi } from '../api/gateway/GatewayApi'

export default {
  name: 'DevicesMain',
  components: {
    DevicesSearchView,
    DeviceControlPanel,
    DropdownMenu,
    RiseLoader
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      mode: import.meta.env.VITE_MODE,
      windowWidth: window.innerWidth,
      searchExpanded: true,
      loadingDevice: false,
      device: undefined, //todo provide
      features: undefined,
      apiMethods: undefined,
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
      this.device = undefined
      this.features = undefined

      this.loadingDevice = true
      try {
        // await DeviceApi.health(selected, this.gateway)
        this.features =
          (await DeviceApi.features(selected, this.gateway).catch((e) => console.log(e))) || {}
        this.apiMethods =
          (await GatewayApi.getDeviceApiMethods({ device: selected, gateway: this.gateway })) ?? []
        this.device = selected
        this.searchExpanded = false
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.unreachable' })
        })
      } finally {
        this.loadingDevice = false
      }
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
      <RiseLoader v-if="loadingDevice" class="rise-loader" />
      <div v-if="device">
        <h1 class="title">
          {{ intl.formatMessage({ id: 'gateway.panel' }, { device: device.name }) }}
        </h1>
        <DeviceControlPanel
          :key="device.ip"
          :device="device"
          :gateway="gateway"
          :features="features"
          :apiMethods="apiMethods"
        />
      </div>
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
