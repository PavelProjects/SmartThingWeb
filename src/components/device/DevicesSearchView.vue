<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { EventBus, toast } from '../../utils/EventBus'
import Container from '../base/Container.vue'
import UpdateButton from '../controls/UpdateButton.vue'
import DeviceItem from './DeviceItem.vue'
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import AddDeviceDialog from './AddDeviceDialog.vue'
import ContextMenu from '../menu/ContextMenu.vue'
import { useStompClientStore } from '../../store/stompClientStore'

const SEARCH_TOPIC = '/devices/search'

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
  emits: ['select', 'deviceDeleted'],
  props: {
    title: String,
    gateway: Object,
    selected: Object
  },
  data() {
    const intl = useIntl()
    const stompClient = useStompClientStore()
    return {
      intl,
      stompClient,
      devices: {},
      savedDevices: {},
      searching: false,
      loadingSaved: false,
      addDeviceVisible: false
    }
  },
  mounted() {
    this.loadFoundDevices()
    this.loadSavedDevices()

    this.stompClient.subscribe(SEARCH_TOPIC, (message) => {
      if (message && message.body) {
        const deviceInfo = JSON.parse(message.body)
        if (!this.devices[deviceInfo.ip]) {
          this.devices[deviceInfo.ip] = deviceInfo
        }
      } else {
        console.warn('Empty search topic message')
      }
    })
    EventBus.on('deviceUpdate', ({ device: { ip }, name }) => {
      if (this.devices[ip]) {
        this.devices[ip].name = name
      }
      if (this.savedDevices[ip]) {
        this.savedDevices[ip].name = name
        GatewayApi.updateSavedDevice(ip, this.gateway).catch(console.log)
      }
    })
  },
  unmounted() {
    this.stompClient.unsubscribe(SEARCH_TOPIC)
  },
  methods: {
    async loadFoundDevices() {
      this.searching = true
      try {
        const foundDevices = await GatewayApi.getFoundDevices(this.gateway)
        this.devices = foundDevices.reduce((acc, device) => {
          acc[device.ip] = device
          return acc
        }, {})
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load found devices'
        })
      } finally {
        this.searching = false
      }
    },
    async loadSavedDevices() {
      this.loadingSaved = true
      try {
        const devices = (await GatewayApi.getSavedDevices(this.gateway)) ?? []
        this.savedDevices = devices.reduce((acc, device) => {
          acc[device.ip] = device
          return acc
        }, {})
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
        this.$emit("deviceDeleted", ip)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.saved.menu.delete.error' })
        })
      } finally {
        this.loadingSaved = false
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
  <Container class="devices-search-view" :vertical="true">
    <h2 v-if="title" class="title">{{ title }}</h2>
    <Container class="bordered" :vertical="true">
      <div style="position: relative">
        <h2 class="title list-title">{{ intl.formatMessage({ id: 'devices.saved' }) }}</h2>
        <UpdateButton class="update" :loading="loadingSaved" :onClick="loadSavedDevices" />
      </div>
      <Container class="devices-list" :vertical="true">
        <div
          v-for="[ip, deviceInfo] of Object.entries(savedDevices)"
          :key="ip"
          class="device-item saved-item"
        >
          <DeviceItem
            :selected="selected?.ip == ip"
            :device="deviceInfo"
            @click="() => handleClick(ip, deviceInfo)"
          />
          <ContextMenu class="context-menu">
            <p @click="updateSavedDevice(ip)">
              {{ intl.formatMessage({ id: 'devices.saved.menu.update' }) }}
            </p>
            <p @click="deleteSavedDevice(ip)">
              {{ intl.formatMessage({ id: 'devices.saved.menu.delete' }) }}
            </p>
          </ContextMenu>
        </div>
        <h2 v-if="!loadingSaved && Object.keys(savedDevices).length == 0" class="title">
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
    <Container class="bordered" :vertical="true">
      <div style="position: relative">
        <h2 class="title list-title">{{ intl.formatMessage({ id: 'devices.search' }) }}</h2>
        <UpdateButton class="update" :loading="searching" :onClick="loadFoundDevices" />
      </div>
      <Container class="devices-list" :vertical="true">
        <DeviceItem
          v-for="[ip, deviceInfo] of Object.entries(devices)"
          :key="ip"
          :selected="selected?.ip == ip"
          :device="deviceInfo"
          @click="() => handleClick(ip, deviceInfo)"
        />
        <h2 v-if="!searching && Object.keys(devices).length == 0" class="title">
          {{ intl.formatMessage({ id: 'devices.search.empty' }) }}
        </h2>
        <h2 v-if="searching && Object.keys(devices).length == 0" class="title">
          {{ intl.formatMessage({ id: 'devices.search.in.progress' }) }}
        </h2>
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
