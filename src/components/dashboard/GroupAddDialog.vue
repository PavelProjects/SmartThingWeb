<script>
import { useIntl } from 'vue-intl'
import { DashboardApi } from '../../api/DashboardApi'
import { useDashboardStore } from '../../store/dashboardStore'
import { toast } from '../../utils/EventBus'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
export default {
  name: 'GroupAddDialog',
  components: { PopUpDialog, DevicesSearchView },
  data() {
    const intl = useIntl()
    return { intl }
  },
  methods: {
    async selectDevice(newDev) {
      const { groups } = useDashboardStore()
      const exists = groups.find(({ device }) => (
        device.ip === newDev.ip && device.name === newDev.name
      ))
      if (exists) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'dashboard.group.create.error.exists' })
        })
        return
      }
      try {
        await DashboardApi.createGroup({ device: newDev, observables: [] })
        this.$emit('close', true)
        toast.success({
          caption: this.intl.formatMessage({ id: 'dashboard.group.create.success' }, { name: newDev.name })
        })
      } catch (error) {
        console.log(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'dashboard.group.create.error' })
        })
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
        :title="intl.formatMessage({ id: 'dashboard.group.create.select.device' })"
        :style="{ 'width': '350px' }"
        @select="selectDevice"
      />
    </div>
  </PopUpDialog>
</template>