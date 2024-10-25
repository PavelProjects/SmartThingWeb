<script>
import { useIntl } from 'vue-intl'
import { useStompClientStore } from '../../store/stompClientStore'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import DeviceItem from '../device/DeviceItem.vue'
import { toast } from '../../utils/EventBus'
import { OtaApi } from '../../api/gateway/OtaApi'

export default {
  name: 'OtaFirmwareUploadItem',
  components: {
    BaseContainer,
    DeviceItem,
    LoadingButton
  },
  props: {
    uploadProgress: Object
  },
  data() {
    const intl = useIntl()
    const { taskId, firmware, device, progress, status } = this.uploadProgress
    const stompClient = useStompClientStore()

    return {
      intl,
      taskId,
      firmware,
      device,
      progress,
      status,
      stompClient
    }
  },
  computed: {
    progressBarStyle() {
      return {
        width: this.progress + '%'
      }
    }
  },
  mounted() {
    this.stompClient.subscribe('/ota/' + this.taskId, (message) => {
      if (!message.body) {
        return
      }
      const progressInfo = JSON.parse(message.body)
      this.status = progressInfo.status
      this.progress = progressInfo.progress
    })
  },
  unmounted() {
    this.stompClient.unsubscribe('/ota/' + this.taskId)
  },
  methods: {
    async abort() {
      if (
        !confirm(
          this.intl.formatMessage({ id: 'ota.upload.abort.confirm' }, { device: this.device.name })
        )
      ) {
        return
      }

      try {
        await OtaApi.abortFirmwareUpload(this.taskId)
        toast.success({ caption: this.intl.formatMessage({ id: 'ota.upload.abort.success' }) })
      } catch (error) {
        toast.error({ caption: this.intl.formatMessage({ id: 'ota.upload.abort.error' }) })
      }
    }
  }
}
</script>

<template>
  <BaseContainer class="bordered" :vertical="true" :gap="'0px'">
    <div class="info-view">
      <div class="firmware-info">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'ota.upload.block.firmware' }) }}
        </h2>
        <h3>{{ intl.formatMessage({ id: 'ota.firmware.info.board' }) }}: {{ firmware.board }}</h3>
        <h3>{{ intl.formatMessage({ id: 'ota.firmware.info.type' }) }}: {{ firmware.type }}</h3>
        <h3>
          {{ intl.formatMessage({ id: 'ota.firmware.info.version' }) }}: {{ firmware.version }}
        </h3>
      </div>
      <div class="device-info">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'ota.upload.block.device' }) }}
        </h2>
        <DeviceItem :device="device" />
      </div>
    </div>
    <BaseContainer class="upload-progress-container" :vertical="true">
      <BaseContainer>
        <h3>
          {{ intl.formatMessage({ id: 'ota.upload.status' }, { status }) }}
        </h3>
        <LoadingButton
          v-if="!['FINISHED', 'FIRMWARE_TRANSFER_FINISHED', 'ABORTED'].includes(status)"
          class="abort-button"
          @click="() => abort()"
        >
          {{ intl.formatMessage({ id: 'ota.upload.abort' }) }}
        </LoadingButton>
      </BaseContainer>
      <div v-if="progress" class="upload-progress" :style="progressBarStyle">
        <h3 class="upload-progress-percent">{{ progress }}%</h3>
      </div>
    </BaseContainer>
  </BaseContainer>
</template>

<style scoped>
.info-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--color-border);
}
.firmware-info {
  border-right: 1px solid var(--color-border);
  padding: var(--default-padding);
}
.device-info {
  padding: var(--default-padding);
}
.upload-progress-container {
  padding: var(--default-padding);
}
.upload-progress {
  border-radius: var(--border-radius);
  background-color: green;
  padding-left: var(--default-padding);
}
.abort-button {
  width: fit-content;
  margin-left: auto;
  background-color: var(--color-danger);
}
</style>
