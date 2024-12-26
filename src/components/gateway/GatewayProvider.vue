<script>
import { useIntl } from 'vue-intl'
import { CloudApi } from '../../api/CloudApi'
import { EVENT, EventBus, GATEWAY_EVENT, toast } from '../../utils/EventBus'
import { computed } from 'vue'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'

// used in cloud mode to load gateway from path
export default {
  name: 'GatewayProvider',
  components: {
    RiseLoader
  },
  data() {
    const intl = useIntl()

    return {
      intl,
      loading: false,
      gatewayId: this.$route.params.gateway,
      currentPath: this.$route.path,
      gateway: undefined
    }
  },
  inject: ['mode'],
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
  watch: {
    $route() {
      this.gatewayId = this.$route.params.gateway
      this.loadGateway()
    }
  },
  methods: {
    async loadGateway() {
      if (this.mode === 'gateway') {
        this.gateway = {}
        return
      }
      if (!this.gatewayId) {
        this.gateway = undefined
        this.$router.push({ name: 'gateway-selector' })
        return
      }

      this.loading = true
      try {
        const gtw = await CloudApi.getGateway(this.gatewayId)
        if (!gtw || !gtw.online) {
          this.$router.push('/gateways')
        } else {
          this.gateway = gtw
        }
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'cloud.gateway.load.failed' })
        })
      } finally {
        this.loading = false
      }
    },
    handleGatewayEvent({ gateway, event }) {
      if (!gateway || !Object.values(GATEWAY_EVENT).includes(event)) {
        return
      }
      if (event === GATEWAY_EVENT.CONNECTED) {
        toast.info({
          caption: this.intl.formatMessage({ id: 'cloud.gateway.connected' }, gateway)
        })
      } else if (event === GATEWAY_EVENT.DISCONNECTED) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'cloud.gateway.disconnected' }, gateway)
        })
      }
    }
  }
}
</script>

<template>
  <div>
    <RiseLoader v-if="loading" color="var(--color-accent)" />
    <div v-else-if="mode === 'gateway' || gateway || currentPath === '/gateways'">
      <slot></slot>
    </div>
  </div>
</template>
