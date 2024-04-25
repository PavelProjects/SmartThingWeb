import { defineStore } from 'pinia'
import { useGatewayStore } from './gatewayStore'

export const useGatewayAuthStore = defineStore({
  id: 'gateway_auth_store',
  state: () => ({
    user: undefined,
    gateway: undefined
  }),
  actions: {
    setAuthentication(authInfo) {
      if (authInfo) {
        const { user, gateway } = authInfo
        this.user = user
        this.gateway = gateway
      } else {
        this.user = undefined
        this.gateway = undefined
      }
      const gatewayStore = useGatewayStore()
      gatewayStore.gateway = this.gateway
    }
  }
})
