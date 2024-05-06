<script>
import { DeviceApi } from '../../../api/device/DeviceApi'
import TreeList from '../../fields/TreeList.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { toast } from '../../../utils/EventBus'

export default {
  name: 'MetricsView',
  inject: ['device', 'gateway'],
  components: {
    TreeList,
    SyncLoader
  },
  data() {
    return {
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
        this.metrics = await DeviceApi.metrics(this.device, this.gateway)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load device metrics'
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
    <h1 class="title">Device metrics</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <TreeList :values="metrics" />
  </div>
</template>
