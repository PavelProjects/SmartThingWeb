<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import LoadingButton from '../../controls/LoadingButton.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'
import { extractDataFromError } from '../../../api/ApiUtils.js'

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
        const response = (await DeviceApi.getDeviceActionsInfo(this.device, this.gateway)) || {}
        this.actions = Object.entries(response)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch device actions'
        })
      } finally {
        this.loading = false
      }
    },
    async sendAction(action) {
      this.loadingAction = true
      try {
        await DeviceApi.executeDeviceAcion(this.device, action, this.gateway)
        toast.success({
          caption: 'Done'
        })
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to execute action ' + action,
          description
        })
      } finally {
        this.loadingAction = false
      }
    }
  }
}
</script>

<template>
  <div>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="actions.length > 0" class="buttons-panel">
      <LoadingButton
        v-for="[name, caption] of actions"
        :key="name"
        :title="name"
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
  row-gap: var(--default-gap);
  padding: var(--default-gap);
}
.buttons-panel button {
  width: 100%;
  height: 100%;
}
</style>
