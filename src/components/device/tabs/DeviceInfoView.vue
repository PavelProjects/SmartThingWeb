<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import InputField from '../../fields/InputField.vue'
import LoadingButton from '../../controls/LoadingButton.vue'
import { EventBus } from '../../../utils/EventBus.js'
import { useIntl } from 'vue-intl'

export default {
  name: 'DeviceInfoView',
  components: {
    SyncLoader,
    InputField,
    LoadingButton
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      info: null,
      loading: false,
      deviceName: '',
    }
  },
  created() {
    this.loadInfo()
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
      if (!this.deviceName) {
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
    <h1 class="title">{{ intl.formatMessage({ id: 'device.info.title' }) }}</h1>
    <div v-if="info" class="list">
      <InputField
        :label="intl.formatMessage({ id: 'device.info.name' })"
        :title="deviceName ? '' : intl.formatMessage({ id: 'device.info.name.error.empty' })"
        v-model="deviceName"
        :validationFailed="!deviceName"
      >
        <LoadingButton :loading="loading" @click="saveName">
          <h3>{{ intl.formatMessage({ id: 'device.info.name.save' }) }}</h3>
        </LoadingButton>
      </InputField>
      <InputField
        :label="intl.formatMessage({ id: 'device.info.type' })"
        :modelValue="info.type"
        :disabled="true"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.info.version' })"
        :modelValue="info.version"
        :disabled="true"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.info.chip.model' })"
        :modelValue="info.chip_model"
        :disabled="true"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.info.chip.revision' })"
        :modelValue="info.chip_revision"
        :disabled="true"
      />
    </div>
    <sync-loader v-else class="loading-spinner" :loading="true"></sync-loader>
  </div>
</template>
