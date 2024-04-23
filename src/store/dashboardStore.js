import { defineStore } from "pinia";

export const useDashboardStore = defineStore({
  id: 'dashboard_store',
  state: () => ({
    groups: [],
    deviceConfig: {}
  }),
  actions: {
    updateDeviceConfig(group, observables) {
      if (!group?.id) {
        return;
      }
      this.deviceConfig[group.id] = observables || {}
    }
  }
})