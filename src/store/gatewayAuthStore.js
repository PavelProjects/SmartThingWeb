import { defineStore } from 'pinia'

export const useGatewayAuthStore = defineStore({
  id: 'gateway_auth_store',
  state: () => ({
    user: undefined,
    gateway: undefined
  }),
  actions: {
    // move to gateway provider
    setAuthentication(authInfo) {
      if (authInfo) {
        const { user, gateway } = authInfo
        this.user = user
        this.gateway = gateway
      } else {
        this.user = undefined
        this.gateway = undefined
      }
    }
  }
})
