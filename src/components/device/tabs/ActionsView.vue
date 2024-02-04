<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import LoadingButton from '../../controls/LoadingButton.vue'

export default {
  name: 'ActionsView',
  components: {
    LoadingButton,
    SyncLoader
  },
  props: {
    device: Object,
    gateway: String
  },
  data() {
    return {
      actions: null,
      loading: false,
      loadingAction: false
    }
  },
  created() {
    this.loadActions()
  },
  methods: {
    async loadActions() {
      this.loading = true
      try {
        this.actions = (await DeviceApi.getDeviceActionsInfo(this.device, this.gateway)) || []
      } finally {
        this.loading = false
      }
    },
    async sendAction(action) {
      this.loadingAction = true
      try {
        await DeviceApi.executeDeviceAcion(this.device, action, this.gateway)
      } finally {
        this.loadingAction = false
      }
    }
  }
}
</script>

<template>
  <div>
    <h1 class="title">Device actions</h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div class="buttons-panel">
      <LoadingButton
        v-for="(caption, name) in actions"
        :key="name"
        :loading="loadingAction"
        @click="sendAction(name)"
      >
        <h1>{{ caption }}</h1>
      </LoadingButton>
    </div>
  </div>
</template>

<style scoped>
* {
  text-align: center;
}
.buttons-panel {
  display: grid;
  row-gap: 5px;
  padding: 5px;
}
.buttons-panel button {
  width: 100%;
  height: 100%;
}
</style>
