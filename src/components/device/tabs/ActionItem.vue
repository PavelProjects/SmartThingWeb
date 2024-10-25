<script>
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'
import { extractDataFromError } from '../../../api/ApiUtils.js'
import TimerOutline from 'vue-material-design-icons/TimerOutline.vue'
import BaseContainer from '../../base/BaseContainer.vue'
import ModalDialog from '../../base/ModalDialog.vue'
import InputField from '../../base/fields/InputField.vue'

export default {
  name: 'ActionItem',
  components: {
    LoadingButton,
    BaseContainer,
    ModalDialog,
    InputField,
    TimerOutline
  },
  props: {
    action: Object
  },
  inject: ['device', 'gateway', 'features'],
  emits: ['delayUpdated'],
  data() {
    const { callDelay } = this.action
    const intl = useIntl()
    return {
      intl,
      callDelay,
      loading: false,
      scheduleVisible: false
    }
  },
  methods: {
    async callAction(action) {
      this.loading = true
      try {
        await DeviceApi.callAction(this.device, action, this.gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'device.actions.call.succes' })
        })
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.actions.call.error' }, { action }),
          description
        })
      } finally {
        this.loading = false
      }
    },
    async updateDelay(value) {
      if (value !== undefined) {
        this.callDelay = value
      }

      if (this.action.callDelay === this.callDelay) {
        this.scheduleVisible = false
        return
      }

      if (this.callDelay < 0) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'device.actions.delay.validation.error' })
        })
      } else {
        if (
          this.callDelay === 0 &&
          !confirm(this.intl.formatMessage({ id: 'device.actions.delay.disable.confirm' }))
        ) {
          return
        }

        try {
          await DeviceApi.actionSchedule(this.device, this.action.name, this.callDelay)
          toast.success({
            caption: this.intl.formatMessage(
              { id: 'device.actions.delay.update.success' },
              this.action
            )
          })
          this.scheduleVisible = false
          this.$emit('delayUpdated')
        } catch (error) {
          toast.error({
            caption: this.intl.formatMessage({ id: 'device.actions.delay.update.error' })
          })
        }
      }
    }
  }
}
</script>

<template>
  <BaseContainer :vertical="false">
    <LoadingButton
      class="action-button"
      :title="
        intl.formatMessage({ id: 'device.actions.title' }, { callDelay: 0, lastCall: 0, ...action })
      "
      :loading="loading"
      @click="callAction(action.name)"
    >
      <h1>{{ action.caption }}</h1>
    </LoadingButton>
    <TimerOutline
      v-if="features.actionsScheduler"
      class="timer-icon"
      @click="() => (scheduleVisible = true)"
    />
    <ModalDialog v-if="scheduleVisible" @close="() => (scheduleVisible = false)">
      <BaseContainer class="schedule-dialog" :vertical="true">
        <h2 class="title">
          {{ intl.formatMessage({ id: 'device.actions.delay.title' }) }}
        </h2>
        <InputField
          :label="intl.formatMessage({ id: 'device.actions.delay.label' })"
          v-model="callDelay"
          type="number"
        />
        <BaseContainer class="controls-holder" :vertical="false">
          <LoadingButton class="disable-button" @click="() => updateDelay(0)">
            <h2>
              {{ intl.formatMessage({ id: 'device.actions.delay.disable' }) }}
            </h2>
          </LoadingButton>
          <LoadingButton @click="() => updateDelay()">
            <h2>
              {{ intl.formatMessage({ id: 'device.actions.delay.save' }) }}
            </h2>
          </LoadingButton>
        </BaseContainer>
      </BaseContainer>
    </ModalDialog>
  </BaseContainer>
</template>

<style scoped>
.action-button {
  width: 100%;
}
.timer-icon {
  cursor: pointer;
}
.schedule-dialog {
  padding: var(--default-padding);
}
.controls-holder .btn {
  width: 100%;
}
.disable-button {
  background-color: var(--color-danger);
}
</style>
