<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi, extractDataFromError } from '../../../api/device/DeviceApi.js'
import InputField from '../../fields/InputField.vue'
import LoadingButton from '../../controls/LoadingButton.vue'
import { EventBus, toast } from '../../../utils/EventBus.js'
import { useIntl } from 'vue-intl'
import Container from '../../base/Container.vue'

export default {
  name: 'DeviceInfoView',
  components: {
    SyncLoader,
    InputField,
    LoadingButton,
    Container
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      info: null,
      loading: false,
      deviceName: ''
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
      try {
        this.info = (await DeviceApi.getDeviceInfo(this.device, this.gateway)) || {}
        this.deviceName = this.info['name'] || ''
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch device info'
        })
      }
    },
    async saveName() {
      if (!this.deviceName) {
        console.error('Not valid name')
        return
      }
      this.loading = true
      try {
        await DeviceApi.saveName(this.device, this.deviceName, this.gateway)
        toast.success({
          caption: 'Device name updated!'
        })
        await this.loadInfo()
        EventBus.emit('deviceUpdate', {
          device: this.device,
          name: this.deviceName
        })
      } catch (error) {
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to save device name',
          description
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <div>
    <Container v-if="info" class="fields-list" :vertical="true">
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
        :label="intl.formatMessage({ id: 'device.info.platform' })"
        :modelValue="info.platform"
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
    </Container>
    <sync-loader v-else class="loading-spinner" :loading="true"></sync-loader>
  </div>
</template>

<style scoped>
.fields-list {
  width: 60%;
  margin: auto;
  padding-bottom: var(--default-gap);
}
</style>
