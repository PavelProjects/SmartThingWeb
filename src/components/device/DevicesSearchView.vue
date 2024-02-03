<script>
import { SearchApi } from '../../api/SearchDevicesApi';
import { EventBus, REQUEST } from '../../utils/EventBus';
import UpdateButton from '../controls/UpdateButton.vue';
import DeviceItem from './DeviceItem.vue'

export default {
  components: {
    UpdateButton,
    DeviceItem
  },
  props: {
    gateway: Object,
    title: String,
  },
  data() {
    return {
      devices: {},
      loading: false,
      selectedIp: undefined,
    }
  },
  watch: {
    gateway() {
      this.devices = {}
      this.search();
    }
  },
  mounted() {
    this.search();
    EventBus.on("deviceUpdate", ({ device, name }) => {
      this.devices[device.ip]["name"] = name
    })
  },
  methods: {
    search() {
      this.loading = true;
      const foundDevices = []
      EventBus.on(REQUEST, ({ id, loading }) => {
        if (id == 'search') {
          this.loading = loading;
          if (!this.loading) {
            Object.keys(this.devices).forEach((key) => {
              if (!key in foundDevices) {
                delete this.devices[key]
                if (this.selectedIp == key) {
                  this.selectedIp = undefined
                }
              }
            })
          }
        }
      })
      SearchApi.searchDevices((deviceInfo) => {
        if (!this.devices[deviceInfo.ip]) {
          this.devices[deviceInfo.ip] = deviceInfo
          foundDevices.push(deviceInfo.ip)
          console.debug(`Found new device: ${deviceInfo.name}`)
        }
      }, this.gateway);
    },
    handleClick(ip, deviceInfo) {
      this.selectedIp = ip
      this.$emit('select', deviceInfo)
    }
  },
}
</script>

<template>
  <div>
    <div style="position: relative;">
      <h1 class="title">{{ !!title ? title :"Found devices" }}</h1>
      <UpdateButton class="update" :loading="loading" :onClick="search" />
    </div>
    <div class="search-results">
      <DeviceItem 
        v-for="[ip, deviceInfo] in Object.entries(devices)" 
        :key="ip" 
        :selected="selectedIp == ip"
        :device="deviceInfo"
        @click="() => handleClick(ip, deviceInfo)"
      />
    </div>
  </div>
</template>

<style scoped>
.update {
  position: absolute;
  right: 0px;
  top: 5px;
}
.search-results {
  display: flex;
  flex-direction: column;
  row-gap: var(--default-gap);
  height: fit-content;
  width: 400px;
}
</style>
