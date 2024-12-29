<script>
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import LoadingButton from '../../base/controls/LoadingButton.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'
import { extractDataFromError } from '../../../api/ApiUtils.js'
import BaseContainer from '../../base/BaseContainer.vue'
import ModalDialog from '../../base/ModalDialog.vue'
import InputField from '../../base/fields/InputField.vue'

export default {
  name: 'ActionItem',
  components: {
    LoadingButton,
    BaseContainer,
    ModalDialog,
    InputField
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
  <BaseContainer :vertical="false" class="action-container">
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
    <svg
      v-if="features.actionsScheduler"
      class="timer-icon"
      fill="currentColor"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      @click="() => (scheduleVisible = true)"
    >
      <path
        d="M12,20A7,7 0 0,1 5,13A7,7 0 0,1 12,6A7,7 0 0,1 19,13A7,7 0 0,1 12,20M19.03,7.39L20.45,5.97C20,5.46 19.55,5 19.04,4.56L17.62,6C16.07,4.74 14.12,4 12,4A9,9 0 0,0 3,13A9,9 0 0,0 12,22C17,22 21,17.97 21,13C21,10.88 20.26,8.93 19.03,7.39M11,14H13V8H11M15,1H9V3H15V1Z"
      ></path>
    </svg>
    <ModalDialog :open="scheduleVisible" @close="() => (scheduleVisible = false)">
      <BaseContainer class="schedule-dialog" :vertical="true">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'device.actions.delay.title' }) }}
        </h2>
        <InputField
          :label="intl.formatMessage({ id: 'device.actions.delay.label' })"
          v-model="callDelay"
          type="number"
        />
        <BaseContainer class="controls-holder" :vertical="false">
          <LoadingButton class="action-button disable-button" @click="() => updateDelay(0)">
            <h2>
              {{ intl.formatMessage({ id: 'device.actions.delay.disable' }) }}
            </h2>
          </LoadingButton>
          <LoadingButton class="action-button" @click="() => updateDelay()">
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
.action-container {
  align-items: center;
}
.action-button {
  width: 100%;
}
.timer-icon {
  cursor: pointer;
}
.schedule-dialog {
  padding: var(--default-padding);
}
.disable-button {
  background-color: var(--color-danger);
}
</style>
