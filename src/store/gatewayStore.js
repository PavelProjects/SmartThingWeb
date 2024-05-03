import { defineStore } from 'pinia'

export const useGatewayStore = defineStore({
  id: 'control_panel',
  state: () => {
    return {
      gateway: undefined,
      device: undefined,
      features: {}
    }
  }
})
