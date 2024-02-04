<script>
import { CloudApi } from '../../api/CloudApi'
import { router } from '../../routes'
import { toast } from '../../utils/EventBus'
import GatewayItem from './GatewayItem.vue'
import GatewayEditDialog from './GatewayEditDialog.vue'

export default {
  name: 'GatewaySelector',
  components: {
    GatewayItem,
    GatewayEditDialog
  },
  data() {
    return {
      gateways: [],
      selected: undefined,
      loading: false,
      listVisible: false,
      showDialog: false,
      gatewayToEdit: undefined
    }
  },
  async mounted() {
    await this.loadGateways()
    this.selectFromPath()
  },
  watch: {
    '$route.params.gateway': {
      handler() {
        this.selectFromPath()
      }
    },
    selected() {
      if (this.selected) {
        router.push('/panel/' + this.selected.id)
      }
    }
  },
  methods: {
    selectFromPath() {
      const fromPath = this.$route.params.gateway
      if (fromPath) {
        this.selected = this.gateways.find(({ id }) => id === fromPath)
      } else {
        this.selected = undefined
      }
    },
    handleTitleClick() {
      this.listVisible = !this.listVisible
      if (this.listVisible) {
        this.loadGateways()
      }
    },
    handleGatewayClick(gateway) {
      if (!gateway.online) {
        toast.error({
          caption: 'Gateway is offline!',
          description: "Can't open control panel of offline gateway"
        })
        return
      }
      this.selected = gateway
      this.listVisible = false
    },
    async loadGateways() {
      this.loading = true
      try {
        this.gateways = (await CloudApi.getGatewaysList()) || []
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
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
  <div class="gateway-selector bordered">
    <div class="current-gateway title" @click="handleTitleClick">
      <h2 v-if="selected">Current: {{ selected.name }}</h2>
      <h2 v-else>Select gateway</h2>
    </div>
    <div v-if="listVisible && !gatewayToEdit">
      <div class="gateways-list">
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
      <div class="overlay" @click="listVisible = false"></div>
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
  position: relative;
}
.gateway-selector .title {
  cursor: pointer;
}
.current-gateway {
  user-select: none;
  padding: 0px 2px;
}
.gateways-list {
  position: absolute;
  top: calc(var(--doc-height) - 2px);
  display: flex;
  flex-direction: column;
  gap: var(--default-gap);
  z-index: 999;
}

.overlay {
  position: fixed;
  left: 0px;
  top: var(--doc-height);
  width: 100%;
  height: 100%;
  background-color: var(--background-tilt);
  z-index: 900;
}
</style>
