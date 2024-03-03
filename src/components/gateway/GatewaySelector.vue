<script>
import { CloudApi } from '../../api/CloudApi'
import { router } from '../../routes'
import { toast } from '../../utils/EventBus'
import GatewayItem from './GatewayItem.vue'
import GatewayEditDialog from './GatewayEditDialog.vue'
import UpdateButton from '../controls/UpdateButton.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'

export default {
  name: 'GatewaySelector',
  components: {
    GatewayItem,
    GatewayEditDialog,
    UpdateButton,
    PopUpDialog,
  },
  data() {
    return {
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
      console.log(1)
      if (gateway.online) {
        router.push('/panel/' + gateway.id)
      } else {
        toast.error({
          caption: 'Gateway is offline!',
          description: "Can't open control panel of offline gateway"
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
          caption: 'Gateway created'
        })
        this.loadGateways()
        this.showCreateDialog = false
      } else {
        toast.error({
          caption: 'Failed to create gateway'
        })
      }
    },
  }
}
</script>

<template>
  <div class="gateway-selector">
    <div class="header">
      <h2 class="title">Gateways</h2>
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
      <button class="btn" @click="showCreateDialog = true">Add gateway</button>
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
