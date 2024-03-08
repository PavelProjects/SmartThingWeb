import { defineStore } from "pinia";
import { EventBus, LOGGED_IN, LOGGED_OUT } from "../utils/EventBus";

export const useCloudAuthStore = defineStore({
  id: 'cloud_auth_store',
  state: () => ({
    id: undefined,
    login: undefined,
  }),
  actions: {
    setAuthentication(user) {
      if (user) {
        this.id = user.id,
        this.login = user.login
      } else {
        this.id = undefined,
        this.login = undefined
        EventBus.emit(LOGGED_OUT)
      }

      EventBus.emit(this.login ? LOGGED_IN : LOGGED_OUT)
    }
  }
})