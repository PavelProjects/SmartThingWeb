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
    return {
      infoUI: BUILD_INFO,
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
        console.log('Failed to load backend build info', error)
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
        <TreeView :values="gatewayInfo" />
      </BaseContainer>
      <BaseContainer v-if="mode === 'gateway'" :vertical="true">
        <h2 class="header">UI build info</h2>
        <p v-for="[key, value] of Object.entries(infoUI)" :key="key">
          {{ camelToNormal(key) }}: {{ value }}
        </p>
      </BaseContainer>
    </BaseContainer>
  </ModalDialog>
</template>

<style scoped>
.build-info {
  padding: var(--default-padding);
}
</style>
