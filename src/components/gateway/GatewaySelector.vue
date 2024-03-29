<script>
import { CloudApi } from '../../api/CloudApi'
import { router } from '../../routes'
import { toast } from '../../utils/EventBus'
import GatewayItem from './GatewayItem.vue'
import GatewayEditDialog from './GatewayEditDialog.vue'
import UpdateButton from '../controls/UpdateButton.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import { useControlPanelStore } from '../../store/controlPanelStore'
import { useIntl } from 'vue-intl'

export default {
  name: 'GatewaySelector',
  components: {
    GatewayItem,
    GatewayEditDialog,
    UpdateButton,
    PopUpDialog,
  },
  data() {
    const intl = useIntl()
    const controlPanelStore = useControlPanelStore()
    return {
      intl,
      controlPanelStore,
      gateways: [],
      loading: false,
      showCreateDialog: false,
    }
  },
  async mounted() {
    await this.loadGateways()
  },
  methods: {
    handleGatewayClick(gateway) {
      if (gateway.online) {
        this.controlPanelStore.gateway = gateway
        router.push('/panel/' + gateway.id)
      } else {
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.select.offline' }),
          description: this.intl.formatMessage({ id: 'gateway.select.offline.desc' })
        })
      }
    },
    async loadGateways() {
      this.loading = true
      this.gateways = (await CloudApi.getGatewaysList()) || []
      this.loading = false
    },
    async createGateway(gateway) {
      if (await CloudApi.createGateway(gateway)) {
        toast.success({
          caption: this.intl.formatMessage({ id: 'gateway.create.success' })
        })
        this.loadGateways()
        this.showCreateDialog = false
      } else {
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.create.error' })
        })
      }
    },
  }
}
</script>

<template>
  <div class="gateway-selector">
    <div class="header">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'gateway.selector.title' }) }}
      </h2>
      <UpdateButton class="update" :loading="loading" :onClick="loadGateways" />
    </div>
    <div class="list">
      <GatewayItem
        v-for="gateway of gateways"
        :key="gateway.id"
        :gateway="gateway"
        @click="handleGatewayClick(gateway)"
        @gatewaysUpdate="loadGateways"
      />
      <button class="btn" @click="showCreateDialog = true">
        <h2>{{ intl.formatMessage({ id: 'gateway.create.button' }) }}</h2>
      </button>
    </div>
    <GatewayEditDialog
      v-if="showCreateDialog"
      :gateway="{}"
      @save="createGateway"
      @close="gatewayToEdit = undefined"
    />
  </div>
</template>

<style scoped>
.gateway-selector {
  margin: auto;
  width: 300px;
}
.header {
  position: relative;
}
.update {
  position: absolute;
  top: 0px;
  right: 0px;
}
</style>
