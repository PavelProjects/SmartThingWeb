<script>
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'
import ContextMenu from '../menu/ContextMenu.vue'

export default {
  name: 'SettingsDumpItem',
  components: {
    BaseContainer,
    ContextMenu
  },
  emits: ['importToDevice', 'delete'],
  props: {
    settings: Object
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      menuVisible: false
    }
  }
}
</script>

<template>
  <BaseContainer class="device-settings-item" :vertical="true">
    <h3>Device name: {{ settings.device.name }}</h3>
    <h3>Creation date: {{ settings.creationDateTime }}</h3>
    <ContextMenu class="context-menu" :open="menuVisible">
      <p @click="() => $emit('delete')">
        {{ intl.formatMessage({ id: 'device.settings.delete' }) }}
      </p>
      <p @click="() => $emit('importToDevice')">
        {{ intl.formatMessage({ id: 'device.settings.import' }) }}
      </p>
    </ContextMenu>
  </BaseContainer>
</template>

<style scoped>
.device-settings-item {
  position: relative;
  padding: var(--default-padding);
}
.context-menu {
  position: absolute;
  top: 5px;
  right: 0px;
}
</style>
