<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'
import ActionItem from './ActionItem.vue'

export default {
  name: 'ActionsTab',
  components: {
    ActionItem,
    SyncLoader
  },
  inject: ['device', 'gateway', 'features'],
  data() {
    const intl = useIntl()
    return {
      intl,
      actions: [],
      loading: false
    }
  },
  mounted() {
    this.loadActions()
  },
  methods: {
    async loadActions() {
      this.loading = true
      try {
        this.actions = (await DeviceApi.getDeviceActionsInfo(this.device, this.gateway)) || {}
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.actions.fetch.error' })
        })
      } finally {
        this.loading = false
      }
    },
    update() {
      this.loadActions()
    }
  }
}
</script>

<template>
  <div>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="actions.length > 0" class="buttons-panel">
      <ActionItem
        v-for="action of actions"
        :key="action.name"
        :action="action"
        @delayUpdated="() => loadActions()"
      />
    </div>
    <div v-else class="header">
      <h3>{{ intl.formatMessage({ id: 'device.actions.empty' }) }}</h3>
    </div>
  </div>
</template>

<style scoped>
.buttons-panel {
  display: grid;
  row-gap: var(--default-gap);
  padding: var(--default-padding);
}
</style>
