import { defineStore } from "pinia";

export const useControlPanelStore = defineStore({
  id: 'control_panel',
  state: () => {
    return {
      gateway: undefined,
      device: undefined,
    }
  }
})