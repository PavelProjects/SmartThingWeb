<script>
import { useIntl } from 'vue-intl';
import { GatewayApi } from '../../api/gateway/GatewayApi';
import { toast } from '../../utils/EventBus';
import Container from '../base/Container.vue';
import LoadingButton from '../controls/LoadingButton.vue';
import PopUpDialog from '../dialogs/PopUpDialog.vue';
import InputField from '../fields/InputField.vue';

export default {
  name: "AddDeviceDialog",
  components: {
    Container,
    InputField,
    PopUpDialog,
    LoadingButton,
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      ip: "",
      loading: false
    }
  },
  methods: {
    async addDevice() {
      if (!this.ip) {
        toast.error({
          caption: "Ip is required"
        })
        return
      }
      this.loading = true
      try {
        const { name, type } = await GatewayApi.addDevice(this.ip)
        toast.info({
          caption: this.intl.formatMessage({ id: 'devices.saved.add.success' }),
          description: this.intl.formatMessage({ id: 'devices.saved.add.success.desc' }, { name, type })
        })
        this.$emit("added")
      } catch (error) {
        console.error(error)
        const { response } = error || {}
        const { message } = await response?.data || {}
        toast.error({
          caption: this.intl.formatMessage({ id: 'devices.saved.add.error' }),
          description: message ?? ""
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
        <h1 class="title">
          {{ intl.formatMessage({ id: 'devices.saved.add.title' }) }}
        </h1>
        <InputField
          v-model="ip"
          :validationFailed="!ip"
          :label="intl.formatMessage({ id: 'devices.saved.add.input.ip' })"
        />
        <LoadingButton
          :loading="loading"
          @click="addDevice"
        >
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