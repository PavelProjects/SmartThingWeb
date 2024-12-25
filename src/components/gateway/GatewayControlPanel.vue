<script>
import DevicesSearchView from '../device/DevicesSearchView.vue'
import DeviceControlPanel from '../device/DeviceControlPanel.vue'
import { useIntl } from 'vue-intl'
import LoadingButton from '../base/controls/LoadingButton.vue'
import BaseContainer from '../base/BaseContainer.vue'
import { h } from 'vue'

export default {
  name: 'GatewayControlPanel',
  components: {
    DevicesSearchView,
    DeviceControlPanel,
    LoadingButton,
    BaseContainer
  },
  inject: ['gateway', 'mode'],
  data() {
    const intl = useIntl()
    return {
      intl,
      windowWidth: window.innerWidth,
      searchExpanded: true,
      device: undefined,
      searchComponent: h(DevicesSearchView, {})
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
    },
    selectedDevice() {
      return this.device?.[0]
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
      if (this.device?.ip === ip) {
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
      <BaseContainer class="search-container">
        <LoadingButton v-if="!searchExpanded" @click="() => (searchExpanded = true)">
          <BaseContainer class="search-expand">
            <svg
              fill="currentColor"
              width="30"
              height="30"
              viewBox="0 0 24 24"
              @click="() => (searchExpanded = false)"
            >
              <path
                d="M6,4H18V5H21V7H18V9H21V11H18V13H21V15H18V17H21V19H18V20H6V19H3V17H6V15H3V13H6V11H3V9H6V7H3V5H6V4M11,15V18H12V15H11M13,15V18H14V15H13M15,15V18H16V15H15Z"
              ></path>
            </svg>
            <p>
              {{ intl.formatMessage({ id: 'gateway.panel.devices' }) }}
            </p>
          </BaseContainer>
        </LoadingButton>
        <KeepAlive>
          <BaseContainer v-if="searchExpanded">
            <DevicesSearchView
              class="search-view"
              v-model="device"
              @deviceDeleted="handleDeviceDelete"
            />
            <svg
              v-if="selectedDevice"
              fill="currentColor"
              width="35"
              height="35"
              viewBox="0 0 24 24"
              @click="() => (searchExpanded = false)"
            >
              <path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"></path>
            </svg>
          </BaseContainer>
        </KeepAlive>
      </BaseContainer>
      <DeviceControlPanel v-if="selectedDevice" :key="selectedDevice.ip" :device="selectedDevice" />
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

.search-container {
  position: absolute;
  top: var(--default-gap);
  left: var(--default-gap);
  z-index: 990;
}

.search-container button {
  height: fit-content;
}

.search-expand {
  align-items: center;
}

.search-expand p {
  font-size: 16px;
  width: 80px;
}

.search-view {
  box-shadow: rgb(129 133 141 / 35%) 0px 0px 7px 2px;
  background-color: var(--color-background);
}
.device-item:hover {
  transition: background-color 0.5s;
  background-color: var(--color-background-mute);
}
</style>
