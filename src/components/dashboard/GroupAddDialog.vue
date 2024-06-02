<script>
import { storeToRefs } from 'pinia'
import { useIntl } from 'vue-intl'
import { DashboardApi } from '../../api/gateway/DashboardApi'
import { useGatewayStore } from '../../store/gatewayStore'
import { toast } from '../../utils/EventBus'
import DevicesSearchView from '../device/DevicesSearchView.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import Container from '../base/Container.vue'
export default {
  name: 'GroupAddDialog',
  components: { PopUpDialog, DevicesSearchView, Container },
  props: {
    groups: Array
  },
  data() {
    const { gateway } = storeToRefs(useGatewayStore())
    const intl = useIntl()
    return { intl, gateway }
  },
  methods: {
    async selectDevice(newDev) {
      const exists = this.groups.find(({ device }) => (
        device.ip === newDev.ip && device.name === newDev.name
      ))
      if (exists) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'dashboard.group.create.error.exists' })
        })
        return
      }
      try {
        await DashboardApi.createGroup({ device: newDev, observables: [] }, this.gateway)
        this.$emit('close', true)
        toast.success({
          caption: this.intl.formatMessage({ id: 'dashboard.group.create.success' }, { name: newDev.name })
        })
      } catch (error) {
        console.error(error)
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
    <Container :vertical="true">
      <DevicesSearchView
        :title="intl.formatMessage({ id: 'dashboard.group.create.select.device' })"
        :style="{ 'width': '350px' }"
        @select="selectDevice"
      />
    </Container>
  </PopUpDialog>
</template>