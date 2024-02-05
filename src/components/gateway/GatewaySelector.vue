<script>
import { CloudApi } from '../../api/CloudApi'
import { router } from '../../routes'
import { toast } from '../../utils/EventBus'
import GatewayItem from './GatewayItem.vue'
import GatewayEditDialog from './GatewayEditDialog.vue'
import UpdateButton from '../controls/UpdateButton.vue'

export default {
  name: 'GatewaySelector',
  components: {
    GatewayItem,
    GatewayEditDialog,
    UpdateButton,
  },
  data() {
    return {
      gateways: [],
      loading: false,
      showDialog: false,
      gatewayToEdit: undefined
    }
  },
  async mounted() {
    await this.loadGateways()
  },
  methods: {
    handleGatewayClick(gateway) {
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
    async saveGateway(gateway) {
      this.gatewayToEdit = undefined
      let result = false

      if (gateway.id) {
        result = await CloudApi.updateGateway(gateway)
      } else {
        result = await CloudApi.createGateway(gateway)
      }

      if (result) {
        toast.success({
          caption: 'Gateway saved'
        })
        this.showDialog = false
        this.loadGateways()
      } else {
        toast.error({
          caption: 'Failed to save gateway'
        })
      }
    },
    async deleteGateway(gateway) {
      if (confirm('Are you sure ypu want to delete gateway ' + gateway.name + '?')) {
        const res = await CloudApi.deleteGateway(gateway)
        if (res) {
          toast.success({
            caption: 'Gateway was deleted'
          })
          this.loadGateways()
          router.push('/home')
        } else {
          toast.error({
            caption: 'Failed to delete gateway'
          })
        }
      }
    },
    async generateToken(gateway) {
      const { token } = (await CloudApi.authGateway(gateway)) || {}
      if (token) {
        toast.info({
          caption: 'Token generated',
          description: token,
          autoClose: false
        })
        this.loadGateways()
      } else {
        toast.error({
          caption: 'Failed to generate gateway token'
        })
      }
    },
    async logoutGateway(gateway) {
      if (
        !confirm('Are you sure? This action will delete token and disconnect gateway from cloud!')
      ) {
        return
      }
      if (await CloudApi.logoutGateway(gateway)) {
        toast.info({
          caption: 'Token deleted'
        })
        this.loadGateways()
      } else {
        toast.error({
          caption: 'Failed to logout gateway'
        })
      }
    }
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
        class="bordered"
        :key="gateway.id"
        :gateway="gateway"
        @click.stop="handleGatewayClick(gateway)"
        @edit="() => (gatewayToEdit = gateway)"
        @delete="deleteGateway(gateway)"
        @generateToken="generateToken(gateway)"
        @logout="logoutGateway(gateway)"
      />
      <button class="btn" @click="gatewayToEdit = {}">Add gateway</button>
    </div>
    <GatewayEditDialog
      v-if="!!gatewayToEdit"
      :gateway="gatewayToEdit"
      @save="saveGateway"
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
