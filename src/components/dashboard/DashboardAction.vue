<script>
import { useIntl } from 'vue-intl'
import { DeviceApi } from '../../api/device/DeviceApi'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../base/controls/LoadingButton.vue'

export default {
  name: 'DashboardAction',
  components: {
    LoadingButton
  },
  props: {
    device: Object,
    action: String,
    caption: String
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()

    return {
      intl,
      loading: false
    }
  },
  methods: {
    async handleClick() {
      this.loading = true
      try {
        await DeviceApi.callAction(this.device, this.action, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.actions.call.succes' })
        })
      } catch (error) {
        toast.error({
          caption: this.intl.formatMessage(
            { id: 'device.actions.call.error' },
            { action: this.action }
          )
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <LoadingButton class="dashboard-item dashboard-action" :loading="loading" @click="handleClick">
    <h2>{{ caption ?? action }}</h2>
  </LoadingButton>
</template>
