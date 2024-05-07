<script>
import { useIntl } from 'vue-intl'
import { SearchApi } from '../../api/SearchDevicesApi'
import { EventBus, REQUEST, toast } from '../../utils/EventBus'
import Container from '../base/Container.vue'
import UpdateButton from '../controls/UpdateButton.vue'
import DeviceItem from './DeviceItem.vue'

export default {
  name: 'DevicesSearchView',
  components: {
    UpdateButton,
    DeviceItem,
    Container
  },
  emits: ['select'],
  props: {
    title: String,
    gateway: Object,
    selected: Object,
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      devices: {},
      loading: false,
      selectedIp: this.selected?.ip
    }
  },
  watch: {
    gateway() {
      this.devices = {}
      this.search()
    }
  },
  mounted() {
    this.search()
    EventBus.on('deviceUpdate', ({ device, name }) => {
      this.devices[device.ip]['name'] = name
    })
  },
  methods: {
    search() {
      this.loading = true
      const foundDevices = []
      EventBus.on(REQUEST, ({ id, loading }) => {
        if (id == 'search') {
          this.loading = loading
          if (!this.loading) {
            Object.keys(this.devices).forEach((key) => {
              if ((!key) in foundDevices) {
                delete this.devices[key]
                if (this.selectedIp == key) {
                  this.selectedIp = undefined
                }
              }
            })
          }
        }
      })

      try {
        // todo rework
        SearchApi.searchDevices((deviceInfo) => {
          if (!this.devices[deviceInfo.ip]) {
            this.devices[deviceInfo.ip] = deviceInfo
            foundDevices.push(deviceInfo.ip)
            console.debug(`Found new device: ${deviceInfo.name}`)
          }
        })
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load found devices'
        })
      }
    },
    handleClick(ip, deviceInfo) {
      this.selectedIp = ip
      this.$emit('select', deviceInfo)
    }
  }
}
</script>

<template>
  <div class="devices-search-view">
    <div style="position: relative">
      <h2 class="title">{{ !!title ? title : intl.formatMessage({ id: 'devices.search' }) }}</h2>
      <UpdateButton class="update" :loading="loading" :onClick="search" />
    </div>
    <Container class="search-results" :vertical="true">
      <DeviceItem
        v-for="[ip, deviceInfo] of Object.entries(devices)"
        :key="ip"
        :selected="selectedIp == ip"
        :device="deviceInfo"
        @click="() => handleClick(ip, deviceInfo)"
      />
      <h2 v-if="!loading && Object.keys(devices).length == 0" class="title">
        {{ intl.formatMessage({ id: 'devices.search.empty' }) }}
      </h2>
    </Container>
  </div>
</template>

<style scoped>
.devices-search-view {
  width: 350px;
}
.devices-search-view .title{
  border-bottom: 1px solid var(--color-border);
}
.devices-search-view .update {
  position: absolute;
  right: 0px;
  top: 0px;
}
.search-results {
  height: fit-content;
  padding: 2px;
}
.search-results .device-item {
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
}
.search-results .device-item:last-child {
  border-bottom: none;
  border-bottom-left-radius: var(--border-radius);
  border-bottom-right-radius: var(--border-radius);
}
</style>
