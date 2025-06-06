<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import InputField from '../../base/fields/InputField.vue'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import { EventBus, toast } from '../../../utils/EventBus.js'
import { useIntl } from 'vue-intl'
import BaseContainer from '../../base/BaseContainer.vue'
import { extractDataFromError } from '../../../api/ApiUtils.js'

export default {
  name: 'InfoTab',
  components: {
    SyncLoader,
    InputField,
    LoadingButton,
    BaseContainer
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
    <BaseContainer v-if="info" class="fields-list" :vertical="true">
      <InputField
        :label="intl.formatMessage({ id: 'device.info.name' })"
        :title="deviceName ? '' : intl.formatMessage({ id: 'device.info.name.error.empty' })"
        v-model="deviceName"
        :validationFailed="!deviceName"
      >
        <LoadingButton :loading="loading" @click="saveName">
          <p>{{ intl.formatMessage({ id: 'device.info.name.save' }) }}</p>
        </LoadingButton>
      </InputField>
      <InputField
        :label="intl.formatMessage({ id: 'device.info.type' })"
        :modelValue="info.type"
        :disabled="true"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.info.ip' })"
        :modelValue="info.ip"
        :disabled="true"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.info.board' })"
        :modelValue="info.board"
        :disabled="true"
      />
      <InputField
        :label="intl.formatMessage({ id: 'device.info.st.version' })"
        :modelValue="info.stVersion"
        :disabled="true"
      />
      <InputField
        v-if="!!info.version"
        :label="intl.formatMessage({ id: 'device.info.version' })"
        :modelValue="info.version"
        :disabled="true"
      />
    </BaseContainer>
    <sync-loader v-else color="var(--color-accent)" :loading="true"></sync-loader>
  </div>
</template>

<style scoped>
.fields-list {
  width: 60%;
  margin: auto;
  padding: var(--default-padding);
}
</style>
