<script>
import { useIntl } from 'vue-intl'
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { toast } from '../../utils/EventBus'
import Container from '../base/Container.vue'
import LoadingButton from '../controls/LoadingButton.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputField from '../base/fields/InputField.vue'

export default {
  name: 'AddDeviceDialog',
  components: {
    Container,
    InputField,
    PopUpDialog,
    LoadingButton
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      ip: '',
      loading: false
    }
  },
  methods: {
    async addDevice() {
      if (!this.ip) {
        toast.error({
          caption: 'Ip is required'
        })
        return
      }
      this.loading = true
      try {
        const { name, type } = await GatewayApi.addDevice(this.ip, this.gateway)
        toast.info({
          caption: this.intl.formatMessage({ id: 'devices.saved.add.success' }),
          description: this.intl.formatMessage(
            { id: 'devices.saved.add.success.desc' },
            { name, type }
          )
        })
        this.$emit('added')
      } catch (error) {
        console.error(error)
        const { response } = error || {}
        const { message } = (await response?.data) || {}
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.saved.add.error' }),
          description: message ?? ''
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <PopUpDialog v-bind="$attrs">
    <Container class="add-device-dialog" :vertical="true">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'devices.saved.add.title' }) }}
      </h2>
      <InputField
        v-model="ip"
        :validationFailed="!ip"
        :label="intl.formatMessage({ id: 'devices.saved.add.input.ip' })"
      />
      <LoadingButton :loading="loading" @click="addDevice">
        <h2>
          {{ intl.formatMessage({ id: 'devices.saved.add.title' }) }}
        </h2>
      </LoadingButton>
    </Container>
  </PopUpDialog>
</template>

<style scoped>
.add-device-dialog {
  padding: var(--default-gap);
}
</style>
