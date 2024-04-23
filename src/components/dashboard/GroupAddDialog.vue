<script>
import { DashboardApi } from '../../api/DashboardApi'
import { useDashboardStore } from '../../store/dashboardStore'
import { toast } from '../../utils/EventBus'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
export default {
  name: 'GroupAddDialog',
  components: { PopUpDialog, DevicesSearchView },
  methods: {
    async selectDevice(newDev) {
      const { groups } = useDashboardStore()
      const exists = groups.find(({ device }) => (
        device.ip === newDev.ip && device.name === newDev.name
      ))
      if (exists) {
        toast.error({
          caption: "Group for this device already exists"
        })
        return
      }
      try {
        await DashboardApi.createGroup({ device: newDev, observables: [] })
        this.$emit('close', true)
        toast.success({ caption: `Create new group for device ${newDev.name}` })
      } catch (error) {
        console.log(error)
        toast.error({ caption: "Failed to create group" })
      }
    }
  }
}
</script>

<template>
  <PopUpDialog
    v-bind="$props"
  >
    <div class="list">
      <DevicesSearchView
        title="Select device"
        :style="{ 'width': '350px' }"
        @select="selectDevice"
      />
    </div>
  </PopUpDialog>
</template>