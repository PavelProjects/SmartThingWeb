<script>
import { DeviceApi } from '../../../api/device/DeviceApi'
import { toast } from '../../../utils/EventBus'
import BaseContainer from '../../base/BaseContainer.vue'
import InputField from '../../base/fields/InputField.vue'
import ComboBoxField from '../../base/fields/ComboBoxField.vue'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import { useIntl } from 'vue-intl'

export default {
  name: 'WiFiTab',
  components: {
    BaseContainer,
    InputField,
    ComboBoxField,
    LoadingButton
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      settings: undefined,
      modes: {}
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    async update() {
      try {
        const { settings, modes } = await DeviceApi.getWiFi(this.device, this.gateway)
        this.settings = settings
        this.modes = modes
      } catch (error) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.wifi.load.error' })
        })
      }
    },
    async save() {
      if (!this.settings.ssid || !this.settings.mode) {
        return
      }
      try {
        await DeviceApi.setWiFi(this.device, this.settings, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.wifi.save.success' }),
          description: this.intl.formatMessage({ id: 'device.wifi.save.success.description' })
        })
      } catch (error) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.wifi.save.error' })
        })
      }
    }
  }
}
</script>

<template>
  <BaseContainer v-if="settings" :vertical="true" class="fields-list">
    <InputField
      :label="intl.formatMessage({ id: 'device.wifi.ssid' })"
      v-model="settings.ssid"
      :validationFailed="!settings.ssid"
    />
    <InputField
      :label="intl.formatMessage({ id: 'device.wifi.password' })"
      v-model="settings.password"
    />
    <ComboBoxField
      :label="intl.formatMessage({ id: 'device.wifi.mode' })"
      v-model="settings.mode"
      :items="modes"
      :validationFailed="!settings.mode"
    />
    <LoadingButton @click="() => save()">
      <h2>{{ intl.formatMessage({ id: 'device.config.button.save' }) }}</h2>
    </LoadingButton>
  </BaseContainer>
  <sync-loader v-else class="loading-spinner" :loading="true"></sync-loader>
</template>

<style scoped>
.fields-list {
  width: 60%;
  margin: auto;
  padding-bottom: var(--default-gap);
}
</style>
