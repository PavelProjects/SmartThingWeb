import { defineStore } from "pinia";

export const useAuthStore = defineStore({
  id: 'auth_store',
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