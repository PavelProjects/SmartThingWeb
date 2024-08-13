<script>
import { CloudApi } from '../../api/CloudApi'
import { router } from '../../routes'
import { EVENT, EventBus, GATEWAY_EVENT, toast } from '../../utils/EventBus'
import { computed } from 'vue'

// used in cloud mode to load gateway from path
export default {
  name: 'GatewayProvider',
  data() {
    return {
      mode: import.meta.env.VITE_MODE,
      gatewayId: this.$route.params.gateway,
      currentPath: this.$route.path,
      gateway: undefined
    }
  },
  provide() {
    return { gateway: computed(() => this.gateway) }
  },
  mounted() {
    this.loadGateway()
    EventBus.on(EVENT, this.handleGatewayEvent)
  },
  unmounted() {
    EventBus.off(EVENT, this.handleGatewayEvent)
  },
  methods: {
    async loadGateway() {
      if (this.mode === 'gateway') {
        this.gateway = {}
        return
      }
      if (!this.gatewayId) {
        router.push('/gateways')
        return
      }
      try {
        const gtw = await CloudApi.getGateway(this.gatewayId)
        if (!gtw || !gtw.online) {
          router.push('/gateways')
        } else {
          this.gateway = gtw
        }
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load gateway ' + this.gatewayId
        })
      }
    },
    handleGatewayEvent({ gateway, event }) {
      if (!gateway || !Object.values(GATEWAY_EVENT).includes(event)) {
        return
      }
      if (event === GATEWAY_EVENT.CONNECTED) {
        toast.info({
          caption: `Gateway ${gateway?.name} connected!`
        })
      } else if (event === GATEWAY_EVENT.DISCONNECTED) {
        toast.error({
          caption: `Gateway ${gateway?.name} disconnected!`
        })
      }
    }
  }
}
</script>

<template>
  <div>
    <div v-if="mode === 'gateway' || gateway || currentPath === '/gateways'">
      <slot></slot>
    </div>
  </div>
</template>
