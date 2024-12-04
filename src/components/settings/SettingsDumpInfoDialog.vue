<script>
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import ModalDialog from '../base/ModalDialog.vue'
import DeviceItem from '../device/DeviceItem.vue'

export default {
  name: 'SettingsDumpInfoDialog',
  components: {
    ModalDialog,
    BaseContainer,
    DeviceItem,
    LoadingButton
  },
  emits: ['importToDevice', 'delete'],
  props: {
    settings: Object
  },
  data() {
    const intl = useIntl()
    return {
      intl
    }
  }
}
</script>

<template>
  <ModalDialog v-bind="$props">
    <BaseContainer class="settings-dump-info" :vertical="true">
      <h2 class="header">
        {{ intl.formatMessage({ id: 'device.settings.info.header' }) }}
      </h2>
      <h3 class="header">
        {{ intl.formatMessage({ id: 'device.settings.info.device' }) }}
      </h3>
      <DeviceItem :device="settings.device" />
      <h3 class="header">
        {{ intl.formatMessage({ id: 'device.settings.info.date' }) }}
      </h3>
      <h3>{{ settings.creationDateTime }}</h3>
      <h3 class="header">
        {{ intl.formatMessage({ id: 'device.settings.info.dump' }) }}
      </h3>
      <textarea class="dump-view" :value="settings.dump" disabled></textarea>
      <LoadingButton @click="() => $emit('importToDevice')">
        <h3>
          {{ intl.formatMessage({ id: 'device.settings.import' }) }}
        </h3>
      </LoadingButton>
      <LoadingButton @click="() => $emit('delete')">
        <h3>
          {{ intl.formatMessage({ id: 'device.settings.delete' }) }}
        </h3>
      </LoadingButton>
    </BaseContainer>
  </ModalDialog>
</template>

<style scoped>
.settings-dump-info {
  padding: var(--default-padding);
}
.dump-view {
  flex: 1 0 auto;
  font-size: 16px;
  height: 200px;
  resize: none;
}
</style>
