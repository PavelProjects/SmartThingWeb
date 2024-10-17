<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { EventBus, toast } from '../../utils/EventBus'
import Container from '../base/Container.vue'
import UpdateButton from '../base/controls/UpdateButton.vue'
import DeviceItem from './DeviceItem.vue'
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import AddDeviceDialog from './AddDeviceDialog.vue'
import ContextMenu from '../menu/ContextMenu.vue'
import { useStompClientStore } from '../../store/stompClientStore'

const FOUND_TOPIC = '/devices/found'
const LOST_TOPIC = '/devices/lost'
function sortFunction(d1, d2) {
  const l1 = Number(d1.ip.split('.')[3])
  const l2 = Number(d2.ip.split('.')[3])

  if (l1 == l2) {
    return 0
  }
  if (l1 < l2) {
    return -1
  } else {
    return 1
  }
}

export default {
  name: 'DevicesSearchView',
  components: {
    UpdateButton,
    DeviceItem,
    Container,
    AddDeviceDialog,
    ContextMenu,
    PlusSVG
  },
  inject: ['gateway'],
  props: {
    title: String,
    filters: Object,
    multiple: Boolean,
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'deviceDeleted'],
  data() {
    const intl = useIntl()
    const stompClient = useStompClientStore()
    return {
      intl,
      stompClient,
      searchEnabled: true,
      devices: [],
      savedDevices: [],
      searching: false,
      loadingSaved: false,
      addDeviceVisible: false
    }
  },
  mounted() {
    this.loadFoundDevices()
    this.loadSavedDevices()

    EventBus.on('deviceUpdate', ({ device, name }) => {
      let index = this.devices.findIndex(({ ip }) => device.ip === ip)
      if (index > 0) {
        this.devices[index].name = name
      } else {
        index = this.savedDevices.indexOf(({ ip }) => device.ip === ip)
        if (index > 0) {
          this.savedDevices[index].name = name
          GatewayApi.updateSavedDevice(device.ip, this.gateway).catch(console.log)
        }
      }
    })

    this.stompClient.subscribe(FOUND_TOPIC, (message) => {
      if (!message?.body) {
        return
      }
      this.handleDeviceFound(JSON.parse(message.body))
    })
    this.stompClient.subscribe(LOST_TOPIC, (message) => {
      if (!message?.body) {
        return
      }
      this.handleDeviceLost(JSON.parse(message.body))
    })
  },
  unmounted() {
    this.stompClient.unsubscribe(FOUND_TOPIC)
    this.stompClient.unsubscribe(LOST_TOPIC)
  },
  methods: {
    handleDeviceFound(device) {
      const existing = this.devices.find(({ ip, name }) => ip === device.ip && name === device.name)
      if (!existing) {
        this.devices.push(device)
        this.devices.sort(sortFunction)

        if (this.modelValue?.ip === device.ip) {
          toast.info({
            caption: this.intl.formatMessage(
              { id: 'devices.search.found' },
              { device: device.name }
            ),
            autoClose: false
          })
        }
      }
    },
    handleDeviceLost(device) {
      const oldLength = this.devices.length
      this.devices = this.devices.filter(
        ({ ip, name }) => !(device.ip == ip && device.name == name)
      )
      if (oldLength !== this.devices.length && this.modelValue?.ip === device.ip) {
        toast.warn({
          caption: this.intl.formatMessage({ id: 'devices.search.lost' }, { device: device.name }),
          autoClose: false
        })
      }
    },
    async loadFoundDevices() {
      this.searching = true
      try {
        this.searchEnabled = await GatewayApi.deviceSearchEnabled(this.gateway)
        if (this.searchEnabled) {
          this.devices = this.filterDevices(await GatewayApi.getFoundDevices(this.gateway)) ?? []
          this.devices.sort(sortFunction)
        }
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.search.load.error' })
        })
      } finally {
        this.searching = false
      }
    },
    async loadSavedDevices() {
      this.loadingSaved = true
      try {
        this.savedDevices = this.filterDevices(await GatewayApi.getSavedDevices(this.gateway)) ?? []
        this.savedDevices.sort(sortFunction)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.saved.load.error' })
        })
      } finally {
        this.loadingSaved = false
      }
    },
    async updateSavedDevice(ip) {
      this.loadingSaved = true
      try {
        await GatewayApi.updateSavedDevice(ip, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'devices.saved.menu.update.success' })
        })
        await this.loadSavedDevices()
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.saved.menu.update.error' })
        })
      } finally {
        this.loadingSaved = false
      }
    },
    async deleteSavedDevice(ip) {
      if (!confirm(this.intl.formatMessage({ id: 'devices.saved.menu.delete.confirm' }))) {
        return
      }
      this.loadingSaved = true
      try {
        await GatewayApi.deleteSavedDevice(ip, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'devices.saved.menu.delete.success' })
        })
        await this.loadSavedDevices()
        this.$emit('deviceDeleted', ip)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.saved.menu.delete.error' })
        })
      } finally {
        this.loadingSaved = false
      }
    },
    filterDevices(list) {
      if (!list) {
        return
      }
      if (!this.filters) {
        return list
      }
      return list.filter((device) => {
        return Object.entries(this.filters).reduce((acc, [key, value]) => {
          acc = acc && device[key] === value
          return acc
        }, true)
      })
    },
    handleClick(deviceInfo) {
      if (this.multiple) {
        if (this.modelValue.includes(deviceInfo)) {
          const index = this.modelValue.indexOf(deviceInfo)
          this.$emit('update:modelValue', [
            ...this.modelValue.slice(0, index),
            ...this.modelValue.slice(index + 1, this.modelValue.length)
          ])
        } else {
          this.$emit('update:modelValue', [...this.modelValue, deviceInfo])
        }
      } else {
        this.$emit('update:modelValue', [deviceInfo])
      }
    }
  }
}
</script>

<template>
  <Container class="devices-search-view" :vertical="true">
    <h2 v-if="title" class="title">{{ title }}</h2>
    <Container class="bordered" :vertical="true">
      <div style="position: relative">
        <h2 class="title list-title">{{ intl.formatMessage({ id: 'devices.search' }) }}</h2>
        <UpdateButton class="update" :loading="searching" :onClick="loadFoundDevices" />
      </div>
      <Container v-if="searchEnabled" class="devices-list" :vertical="true">
        <DeviceItem
          v-for="deviceInfo of devices"
          :key="deviceInfo.ip"
          :selected="modelValue.includes(deviceInfo)"
          :device="deviceInfo"
          @click="() => handleClick(deviceInfo)"
        />
        <h2 v-if="!searching && Object.keys(devices).length == 0" class="title">
          {{ intl.formatMessage({ id: 'devices.search.empty' }) }}
        </h2>
        <h2 v-if="searching && Object.keys(devices).length == 0" class="title">
          {{ intl.formatMessage({ id: 'devices.search.in.progress' }) }}
        </h2>
      </Container>
      <h2 v-else class="title" :title="intl.formatMessage({ id: 'devices.search.disabled.title' })">
        {{ intl.formatMessage({ id: 'devices.search.disabled' }) }}
      </h2>
    </Container>
    <Container class="bordered" :vertical="true">
      <div style="position: relative">
        <h2 class="title list-title">{{ intl.formatMessage({ id: 'devices.saved' }) }}</h2>
        <UpdateButton class="update" :loading="loadingSaved" :onClick="loadSavedDevices" />
      </div>
      <Container class="devices-list" :vertical="true">
        <div
          v-for="(deviceInfo, index) of savedDevices"
          :key="index"
          class="device-item saved-item"
        >
          <DeviceItem
            :selected="modelValue?.ip == deviceInfo.ip"
            :device="deviceInfo"
            @click="() => handleClick(deviceInfo.ip, deviceInfo)"
          />
          <ContextMenu class="context-menu">
            <p @click="updateSavedDevice(deviceInfo.ip)">
              {{ intl.formatMessage({ id: 'devices.saved.menu.update' }) }}
            </p>
            <p @click="deleteSavedDevice(deviceInfo.ip)">
              {{ intl.formatMessage({ id: 'devices.saved.menu.delete' }) }}
            </p>
          </ContextMenu>
        </div>
        <h2 v-if="!loadingSaved && savedDevices.length == 0" class="title">
          {{ intl.formatMessage({ id: 'devices.saved.empty' }) }}
        </h2>
        <PlusSVG
          :title="intl.formatMessage({ id: 'devices.saved.plus.title' })"
          class="plus-icon"
          :size="35"
          @click="addDeviceVisible = true"
        />
      </Container>
    </Container>
    <AddDeviceDialog
      v-if="addDeviceVisible"
      @close="addDeviceVisible = false"
      @added="
        () => {
          addDeviceVisible = false
          loadSavedDevices()
        }
      "
    />
  </Container>
</template>

<style scoped>
.devices-search-view {
  width: 350px;
}
.devices-search-view .list-title {
  border-bottom: 2px solid var(--color-border);
}
.devices-search-view .update {
  position: absolute;
  right: 0px;
  top: 0px;
}
.device-item:hover {
  transition: background-color 0.5s;
  background-color: var(--color-background-mute);
}
.devices-list {
  height: fit-content;
  padding: 2px;
}
.devices-list .device-item {
  cursor: pointer;
  border-bottom: 1px solid var(--color-border);
}
.devices-list .device-item:last-child {
  border-bottom: none;
}
.plus-icon {
  margin: auto;
  cursor: pointer;
}
.saved-item {
  position: relative;
}
.context-menu {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
