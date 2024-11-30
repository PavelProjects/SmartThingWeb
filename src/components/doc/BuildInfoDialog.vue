<script>
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { BUILD_INFO } from '../../buildInfo'
import BaseContainer from '../base/BaseContainer.vue'
import ModalDialog from '../base/ModalDialog.vue'
import TreeView from '../base/TreeView.vue'

export default {
  name: 'BuildInfoDialog',
  components: {
    ModalDialog,
    BaseContainer,
    TreeView
  },
  inject: ['gateway', 'mode'],
  data() {
    const uiInfo = Object.entries(BUILD_INFO).reduce((acc, [key, value]) => {
      acc[this.camelToNormal(key)] = value
      return acc
    }, {})
    return {
      uiInfo,
      gatewayInfo: {}
    }
  },
  mounted() {
    this.loadBackendBuildInfo()
  },
  methods: {
    async loadBackendBuildInfo() {
      try {
        this.gatewayInfo = await GatewayApi.getBuildInfo(this.gateway)
      } catch (error) {
        console.error('Failed to load backend build info', error)
      }
    },
    camelToNormal: (value) => {
      if (typeof value !== 'string') {
        return value
      }
      return value.split('').reduce((acc, ch) => {
        if (ch.toUpperCase() == ch) {
          acc += ' ' + ch.toLowerCase()
        } else {
          acc += ch
        }
        return acc
      }, '')
    }
  }
}
</script>

<template>
  <ModalDialog v-bind="$attrs" size="large">
    <BaseContainer :vertical="true" class="build-info">
      <BaseContainer :vertical="true">
        <h2 class="header">Gateway backend build info</h2>
        <TreeView :values="gatewayInfo" />
      </BaseContainer>
      <BaseContainer v-if="mode === 'gateway'" :vertical="true">
        <h2 class="header">Gateway UI build info</h2>
        <TreeView :values="uiInfo" />
      </BaseContainer>
    </BaseContainer>
  </ModalDialog>
</template>

<style scoped>
.build-info {
  padding: var(--default-padding);
}
</style>
