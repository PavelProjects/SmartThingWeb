import { defineStore } from "pinia";

export const useCloudAuthStore = defineStore({
  id: 'cloud_auth_store',
  state: () => ({
    id: undefined,
    login: undefined,
  }),
  actions: {
    setUser(user) {
      if (user) {
        this.id = user.id,
        this.login = user.login
      } else {
        this.id = undefined,
        this.login = undefined
      }
    }
  }
})