<script>
import { DeviceApi } from '../../../api/device/DeviceApi'
import TreeView from '../../base/TreeView.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { toast } from '../../../utils/EventBus'
import { useIntl } from 'vue-intl'

export default {
  name: 'MetricsView',
  inject: ['device', 'gateway'],
  components: {
    TreeView,
    SyncLoader
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      metrics: {}
    }
  },
  mounted() {
    this.update()
  },
  methods: {
    async update() {
      this.loading = true
      try {
        this.metrics = (await DeviceApi.metrics(this.device, this.gateway)) || {}
        if (this.metrics.uptime) {
          this.metrics.uptime = this.millisToHumanReadable(this.metrics.uptime)
        }
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load device metrics'
        })
      } finally {
        this.loading = false
      }
    },
    millisToHumanReadable(ms) {
      return this.intl.formatMessage(
        { id: 'device.metrics.updatime' },
        {
          days: Math.floor(ms / 86400000),
          hours: Math.floor(ms / 3600000) % 24,
          minutes: Math.floor(ms / 60000) % 60,
          seconds: Math.floor(ms / 1000) % 60
        }
      )
    }
  }
}
</script>

<template>
  <div>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <TreeView :values="metrics" />
  </div>
</template>
