<script>
import BaseContainer from '../../base/BaseContainer.vue'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import { DeviceApi } from '../../../api/device/DeviceApi'
import { toast } from '../../../utils/EventBus'
import { useIntl } from 'vue-intl'

export default {
  name: 'DangerZoneTab',
  components: {
    BaseContainer,
    LoadingButton
  },
  inject: ['gateway', 'device'],
  data() {
    const intl = useIntl()

    return {
      intl,
      restarting: false,
      wiping: false
    }
  },
  methods: {
    async restart() {
      if (!confirm(this.intl.formatMessage({ id: 'danger.restart.confirm' }))) {
        return
      }
      this.restarting = true
      try {
        await DeviceApi.restart(this.device, this.gateway)
        toast.info({ caption: this.intl.formatMessage({ id: 'danger.restart.success' }) })
      } catch (error) {
        if (error?.code === 'ECONNABORTED') {
          toast.warn({
            caption: this.intl.formatMessage({ id: 'danger.restart.success.timeout' }),
            description: this.intl.formatMessage({ id: 'danger.restart.success.timeout.desc' })
          })
          return
        }
        console.error(error)
        toast.error({ caption: this.intl.formatMessage({ id: 'danger.restart.error' }) })
      } finally {
        this.restarting = false
      }
    },
    async wipe() {
      if (
        // todo loop?
        !confirm(this.intl.formatMessage({ id: 'danger.wipe.confirm' }, { step: 1 })) ||
        !confirm(this.intl.formatMessage({ id: 'danger.wipe.confirm' }, { step: 2 })) ||
        !confirm(this.intl.formatMessage({ id: 'danger.wipe.confirm' }, { step: 3 }))
      ) {
        return
      }
      this.wiping = true
      try {
        await DeviceApi.wipe(this.device, this.gateway)
        toast.info({
          caption: this.intl.formatMessage({ id: 'danger.wipe.success' }),
          description: this.intl.formatMessage({ id: 'danger.wipe.success.desc' })
        })
      } catch (error) {
        if (error?.code === 'ECONNABORTED') {
          toast.warn({
            caption: this.intl.formatMessage({ id: 'danger.wipe.success.timeout' }),
            description: this.intl.formatMessage({ id: 'danger.wipe.success.timeout.desc' })
          })
          return
        }
        console.error(error)
        toast.error({ caption: this.intl.formatMessage({ id: 'danger.wipe.error' }) })
      } finally {
        this.wiping = false
      }
    }
  }
}
</script>

<template>
  <div class="danger-container">
    <h1 class="header">
      {{ intl.formatMessage({ id: 'danger.title' }) }}
    </h1>
    <BaseContainer :vertical="true" :gap="'var(--default-gap)'">
      <LoadingButton class="danger-button" @click="restart" :loading="restarting">
        <h1>
          {{ intl.formatMessage({ id: 'danger.button.restart' }) }}
        </h1>
      </LoadingButton>
      <LoadingButton class="danger-button" @click="wipe" :loading="wiping">
        <h1>
          {{ intl.formatMessage({ id: 'danger.button.wipe' }) }}
        </h1>
      </LoadingButton>
    </BaseContainer>
  </div>
</template>

<style scoped>
.danger-container {
  padding: var(--default-padding);
}
.danger-button {
  background-color: var(--color-danger);
}
</style>
