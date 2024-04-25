<script>
import { storeToRefs } from 'pinia'
import { CloudApi } from '../../api/CloudApi'
import { useGatewayStore } from '../../store/gatewayStore'
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
  },
  methods: {
    async loadGateway() {
      if (!this.gatewayId) {
        return
      }
      this.gateway = await CloudApi.getGateway(this.gatewayId)
    }
  }
}
</script>

<template>
  <div>
    <slot></slot>
  </div>
</template>