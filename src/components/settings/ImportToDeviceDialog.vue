<script>
import { useIntl } from 'vue-intl'
import { DeviceApi } from '../../api/device/DeviceApi'
import { toast } from '../../utils/EventBus'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import ModalDialog from '../base/ModalDialog.vue'
import DeviceItem from '../device/DeviceItem.vue'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import { extractDataFromError } from '../../api/ApiUtils'

export default {
  name: 'ImportToDeviceDialog',
  components: {
    BaseContainer,
    ModalDialog,
    DevicesSearchView,
    DeviceItem,
    LoadingButton
  },
  props: {
    settings: Object
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      selectedDevice: undefined
    }
  },
  methods: {
    async importToDevice() {
      if (!this.selectedDevice) {
        return
      }

      this.loading = true
      try {
        await DeviceApi.importSettings(this.selectedDevice, this.gateway, this.settings.dump)
        this.$emit('close')
        toast.success({
          caption: this.intl.formatMessage(
            { id: 'device.settings.import.success' },
            this.selectedDevice
          ),
          description: this.intl.formatMessage({ id: 'device.settings.import.success.desc' })
        })
      } catch (error) {
        if (error?.code === 'ECONNABORTED') {
          this.$emit('close')
          toast.warn({
            caption: this.intl.formatMessage({ id: 'danger.wipe.success.timeout' }),
            description: this.intl.formatMessage({ id: 'danger.wipe.success.timeout.desc' })
          })
        } else {
          console.log(error)
          const { error: description } = await extractDataFromError(error)
          toast.error({
            caption: this.intl.formatMessage({ id: 'device.settings.import.error' }),
            description
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
  <ModalDialog v-bind="$props">
    <BaseContainer class="export-settings" :vertical="true">
      <DevicesSearchView
        v-if="!selectedDevice"
        @update:model-value="(dev) => (selectedDevice = dev[0])"
      />
      <BaseContainer v-else :vertical="true">
        <h2 class="header danger">
          {{ intl.formatMessage({ id: 'device.settings.import.header.danger' }) }}
        </h2>
        <h3>
          {{ intl.formatMessage({ id: 'device.settings.import.header.desc' }) }}
        </h3>
        <h3 class="header">
          {{ intl.formatMessage({ id: 'device.settings.import.target' }) }}
        </h3>
        <DeviceItem :device="selectedDevice" />
        <h3 class="header">
          {{ intl.formatMessage({ id: 'device.settings.import.dump' }) }}
        </h3>
        <textarea class="dump-view" :value="settings.dump" disabled></textarea>
        <LoadingButton @click="() => importToDevice()" :loading="loading">
          <h2>
            {{ intl.formatMessage({ id: 'device.settings.import.confirm' }) }}
          </h2>
        </LoadingButton>
      </BaseContainer>
    </BaseContainer>
  </ModalDialog>
</template>

<style scoped>
.export-settings {
  padding: var(--default-padding);
}
.dump-view {
  flex: 1 0 auto;
  font-size: 16px;
  height: 200px;
  resize: none;
}
.danger {
  color: var(--color-danger);
}
</style>
