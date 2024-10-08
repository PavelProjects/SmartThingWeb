<script>
import { useIntl } from 'vue-intl';
import { useStompClientStore } from '../../store/stompClientStore';
import Container from '../base/Container.vue';
import DeviceItem from '../device/DeviceItem.vue';

export default {
  name: "OtaFirmwareUploadItem",
  components: {
    Container,
    DeviceItem,
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
        width: this.progress + "%"
      }
    }
  },
  mounted() {
    this.stompClient.subscribe('/ota/' + this.taskId, (message) => {
      if (!message.body) {
        return;
      }
      const progressInfo = JSON.parse(message.body)
      this.status = progressInfo.status
      this.progress = progressInfo.progress
    })
  },
  unmounted() {
    this.stompClient.unsubscribe('/ota/' + this.taskId)
  }
}

</script>

<template>
  <Container class="bordered" :vertical="true" :gap="'0px'">
    <div class="info-view">
      <div class="firmware-info">
        <h2 class="title">
          {{ intl.formatMessage({ id: 'ota.upload.block.firmware' }) }}
        </h2>
        <h3>{{ intl.formatMessage({ id: 'ota.firmware.info.board' }) }}: {{  firmware.board }}</h3>
        <h3>{{ intl.formatMessage({ id: 'ota.firmware.info.type' }) }}: {{  firmware.type }}</h3>
        <h3>{{ intl.formatMessage({ id: 'ota.firmware.info.version' }) }}: {{  firmware.version }}</h3>
      </div>
      <div class="device-info">
        <h2 class="title">
          {{ intl.formatMessage({ id: 'ota.upload.block.device' }) }}
        </h2>
        <DeviceItem :device="device" />
      </div>
    </div>
    <div class="upload-progress-container">
      <h3 class="title">
        {{ intl.formatMessage({ id: 'ota.upload.status' }, { status }) }}
      </h3>
      <div v-if="progress" class="upload-progress" :style="progressBarStyle">
        <h3 class="upload-progress-percent">{{ progress }}%</h3>
      </div>
    </div>
  </Container>
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
</style>