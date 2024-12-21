<script>
import ModalDialog from '../base/ModalDialog.vue'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import { DeviceApi } from '../../api/device/DeviceApi'
import { toast } from '../../utils/EventBus'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'

export default {
  name: 'ExportFromDeviceDialog',
  components: {
    ModalDialog,
    DevicesSearchView,
    BaseContainer,
    LoadingButton
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      selectedDevices: undefined
    }
  },
  methods: {
    async exportFromDevice() {
      const device = this.selectedDevices?.[0]
      if (!device) {
        return
      }

      this.loading = true
      try {
        const dump = await DeviceApi.exportSettings(device, this.gateway)
        if (!dump) {
          toast.error({
            caption: this.intl.formatMessage({ id: 'device.settings.export.error.empty' })
          })
          return
        }

        await GatewayApi.saveDeviceSettings({ device: device, dump })
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.settings.export.success' })
        })
        this.$emit('close')
      } catch (error) {
        console.log(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.settings.export.error' })
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <ModalDialog v-bind="$props">
    <BaseContainer class="export-dialog" :vertical="true">
      <DevicesSearchView v-model="selectedDevices" />
      <LoadingButton
        :loading="loading"
        :disabled="!selectedDevices?.length"
        @click="() => exportFromDevice()"
      >
        <h2>
          {{ intl.formatMessage({ id: 'device.settings.export' }) }}
        </h2>
      </LoadingButton>
    </BaseContainer>
  </ModalDialog>
</template>

<style lang="css" scoped>
.export-dialog {
  padding: var(--default-padding);
}
</style>
