<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import InputField from '../../fields/InputField.vue'
import LoadingButton from '../../controls/LoadingButton.vue'
import { EventBus } from '../../../utils/EventBus.js'

const NAME_ERROR = "Name can't be empty!"

export default {
  name: 'DeviceInfoView',
  components: {
    SyncLoader,
    InputField,
    LoadingButton
  },
  props: {
    device: Object,
    gateway: String
  },
  data() {
    return {
      info: null,
      loading: false,
      deviceName: '',
      validName: true,
      NAME_ERROR // bruh
    }
  },
  created() {
    this.loadInfo()
  },
  watch: {
    deviceName(value) {
      this.validName = value.length != 0
    }
  },
  methods: {
    async update() {
      await this.loadInfo()
    },
    async loadInfo() {
      this.info = (await DeviceApi.getDeviceInfo(this.device, this.gateway)) || {}
      this.deviceName = this.info['name'] || ''
    },
    async saveName() {
      if (!this.validName) {
        console.error('Not valid name')
        return
      }
      this.loading = true
      try {
        if (await DeviceApi.saveName(this.device, this.deviceName, this.gateway)) {
          await this.loadInfo()
          EventBus.emit('deviceUpdate', {
            device: this.device,
            name: this.deviceName
          })
        }
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div>
    <h1 class="title">Device information</h1>
    <div v-if="info" class="list">
      <InputField
        label="Device name"
        :title="validName ? '' : NAME_ERROR"
        v-model="deviceName"
        :validationFailed="!validName"
      >
        <LoadingButton :loading="loading" @click="saveName">
          <h3>save</h3>
        </LoadingButton>
      </InputField>
      <InputField label="Device type" :modelValue="info.type" :disabled="true" />
      <InputField label="Firmware version" :modelValue="info.version" :disabled="true" />
      <InputField label="Chip model" :modelValue="info.chip_model" :disabled="true" />
      <InputField label="Chip revision" :modelValue="info.chip_revision" :disabled="true" />
    </div>
    <sync-loader v-else class="loading-spinner" :loading="true"></sync-loader>
  </div>
</template>
