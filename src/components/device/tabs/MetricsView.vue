<script>
import { DeviceApi } from '../../../api/device/DeviceApi'
import TreeList from '../../fields/TreeList.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

export default {
  name: 'MetricsView',
  props: {
    device: Object
  },
  components: {
    TreeList,
    SyncLoader
  },
  data() {
    return {
      loading: false,
      metrics: {},
      gateway: this.$route.params.gateway
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
    <div class="list">
      <TreeList :values="metrics" />
    </div>
  </div>
</template>
