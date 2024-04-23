<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import LoadingButton from '../../controls/LoadingButton.vue'
import { useIntl } from 'vue-intl'

export default {
  name: 'ActionsView',
  components: {
    LoadingButton,
    SyncLoader
  },
  inject: ['device', 'gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      actions: [],
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
    <h1 class="title">
      {{ intl.formatMessage({ id: 'device.actions.title' }) }}
    </h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="actions.length > 0" class="buttons-panel">
      <LoadingButton
        v-for="(caption, name) of actions"
        :key="name"
        :loading="loadingAction"
        @click="sendAction(name)"
      >
        <h1>{{ caption }}</h1>
      </LoadingButton>
    </div>
    <div v-else class="title">
        <h3>{{ intl.formatMessage({ id: 'device.actions.empty' }) }}</h3>
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
