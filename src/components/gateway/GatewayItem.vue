<script>
import DotsVertical from 'vue-material-design-icons/DotsVertical.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import { CLOUD_IP, CLOUD_PORT, CloudApi } from '../../api/CloudApi'
import { toast } from '../../utils/EventBus'
import GatewayEditDialog from './GatewayEditDialog.vue'

export default {
  name: 'GatewayItem',
  props: {
    gateway: Object
  },
  emits: ['gatewaysUpdate', 'click'],
  components: {
    DotsVertical,
    PopUpDialog,
    GatewayEditDialog,
  },
  data() {
    return {
      token: undefined,
      showEditDialog: false
    }
  },
  methods: {
    async saveGateway(gateway) {
      if (await CloudApi.updateGateway(gateway)) {
        toast.success({
          caption: 'Gateway info updated'
        })
        this.$emit('gatewaysUpdate')
        this.showEditDialog = false
      } else {
        toast.error({
          caption: 'Failed to update gateway'
        })
      }
    },
    async deleteGateway() {
      if (confirm('Are you sure ypu want to delete gateway ' + this.gateway.name + '?')) {
        const res = await CloudApi.deleteGateway(this.gateway)
        if (res) {
          toast.success({
            caption: 'Gateway was deleted'
          })
          this.$emit('gatewaysUpdate')
          router.push('/home')
        } else {
          toast.error({
            caption: 'Failed to delete gateway'
          })
        }
      }
    },
    async generateToken() {
      const { token } = (await CloudApi.authGateway(this.gateway)) || {}
      if (token) {
        toast.info({
          caption: 'Token generated',
        })
        this.token = btoa(`${CLOUD_IP}|${CLOUD_PORT}|${token}`)
        this.$emit('gatewaysUpdate')
      } else {
        toast.error({
          caption: 'Failed to generate gateway token'
        })
      }
    },
    async deleteToken() {
      if (
        !confirm('Are you sure? This action will delete token and disconnect gateway from cloud!')
      ) {
        return
      }
      if (await CloudApi.logoutGateway(this.gateway)) {
        toast.info({
          caption: 'Token deleted'
        })
        this.$emit('gatewaysUpdate')
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
  <div class="gateway-item bordered" @click="$emit('click')">
    <div
      class="status"
      :style="{ background: gateway.online ? 'green' : 'red' }"
      :title="gateway.online ? 'Online' : 'Offline'"
    ></div>
    <div class="info">
      <h2>{{ gateway.name }}</h2>
      <h3>{{ gateway.description }}</h3>
    </div>
    <div class="menu" @click.stop="() => {}">
      <DotsVertical class="menu-icon" />
      <div class="menu-items">
        <p @click.stop="showEditDialog = true">Edit</p>
        <p @click.stop="deleteGateway">Delete</p>
        <p v-if="gateway.haveToken" @click.stop="deleteToken">Delete token</p>
        <p v-else @click.stop="generateToken">Token</p>
      </div>
    </div>
  </div>
  <GatewayEditDialog
    v-if="showEditDialog"
    :gateway="gateway"
    @save="saveGateway"
    @close="showEditDialog = false"
  />
  <PopUpDialog v-if="token" @close="token = undefined">
    <p class="token-field">{{ token }}</p>
  </PopUpDialog>
</template>

<style scoped>
.info {
  padding: 0px 30px;
}
.gateway-item {
  background-color: var(--color-background);
  padding: var(--padding-default);
  text-align: center;
  position: relative;
}
.status {
  position: absolute;
  top: var(--padding-default);
  left: var(--padding-default);
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.menu-icon {
  position: absolute;
  top: 0px;
  right: 0px;
}
.menu:hover .menu-items {
  display: block;
}
.menu-items {
  display: none;
  position: absolute;
  top: 5px;
  right: -100px;
  min-width: 100px;
  border: solid 1px var(--color-border);
  border-radius: var(--border-radius);
  background-color: var(--color-background-mute);
  padding: 2px;
}
.menu-items p:hover {
  cursor: pointer;
  opacity: 0.8;
}
.token-field {
  padding: 5px;
  width: 50vw;
  word-wrap: break-word;
}
</style>
