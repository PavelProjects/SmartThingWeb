<script>
import { storeToRefs } from 'pinia'
import { CloudApi } from '../../api/CloudApi'
import { useGatewayStore } from '../../store/gatewayStore'
import { router } from '../../routes'
import { EVENT, EventBus, GATEWAY_EVENT, toast } from '../../utils/EventBus'

export default {
  name: 'GatewayProvider',
  data() {
    const { gateway } = storeToRefs(useGatewayStore())
    return {
      gatewayId: this.$route.params.gateway,
      gateway
    }
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
      if (!this.gatewayId) {
        this.gateway = {}
        return
      }
      const gtw = await CloudApi.getGateway(this.gatewayId)
      if (!gtw || !gtw.online) {
        router.push("/gateways")
      } else {
        this.gateway = gtw
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
    <slot></slot>
  </div>
</template>