<script>
import { GatewayApi } from '../../api/gateway/GatewayApi'
import { BUILD_INFO } from '../../buildInfo'
import Container from '../base/Container.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'

export default {
  name: 'BuildInfoDialog',
  components: {
    PopUpDialog,
    Container
  },
  inject: ['gateway'],
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
  <PopUpDialog v-bind="$attrs">
    <Container :vertical="true" class="build-info">
      <Container :vertical="true">
        <h2 class="title">Gateway backend build info</h2>
        <p v-for="[key, value] of Object.entries(gatewayInfo)" :key="key">{{ camelToNormal(key) }}: {{ value }}</p>
      </Container>
      <Container :vertical="true">
        <h2 class="title">UI build info</h2>
        <p v-for="[key, value] of Object.entries(infoUI)" :key="key">{{ camelToNormal(key) }}: {{ value }}</p>
      </Container>
    </Container>
  </PopUpDialog>
</template>

<style scoped>
.build-info {
  padding: var(--default-padding);
}
</style>
