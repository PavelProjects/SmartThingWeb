<script>
import { OtaApi } from '../../api/gateway/OtaApi'
import Container from '../base/Container.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import { toast } from '../../utils/EventBus'
import AddOtaFirmwareDialog from './AddOtaFirmwareDialog.vue'
import OtaFirmwareItem from './OtaFirmwareItem.vue'
import OtaFirmwareUploadItem from './OtaFirmwareUploadItem.vue'
import { useIntl } from 'vue-intl'
import TreeView from '../base/TreeView.vue'
import { h } from 'vue'

export default {
  name: 'OtaUpdates',
  components: {
    Container,
    LoadingButton,
    AddOtaFirmwareDialog,
    OtaFirmwareUploadItem,
    TreeView
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      firmwaresTree: {},
      runningUploads: [],
      addVisible: false
    }
  },
  mounted() {
    this.loadSaved()
    this.loadRunningUploads()
  },
  methods: {
    async loadSaved() {
      try {
        const savedFirmwares = (await OtaApi.getSavedFirmwares()) ?? []
        this.firmwaresTree = savedFirmwares.reduce((acc, { id, type, version, board }) => {
          if (!acc[type]) {
            acc[type] = {}
          }
          if (!acc[type][version]) {
            acc[type][version] = {}
          }
          acc[type][version][board] = h(OtaFirmwareItem, {
            firmware: { id, type, version, board },
            onDeleted: () => this.loadSaved(),
            onUpdated: () => this.loadSaved(),
            onUploadStarted: () => this.loadRunningUploads()
          })
          return acc
        }, {})
      } catch (error) {
        toast.error({ caption: this.intl.formatMessage({ id: 'ota.load.saved.error' }) })
      }
    },
    async loadRunningUploads() {
      try {
        this.runningUploads = await OtaApi.getRunningUploads()
      } catch (error) {
        toast.error({ caption: this.intl.formatMessage({ id: 'ota.load.running.error' }) })
      }
    }
  }
}
</script>

<template>
  <Container id="ota-updates" style="width: fit-content" :gap="'10vw'">
    <Container :vertical="true">
      <h1 class="title">
        {{ intl.formatMessage({ id: 'ota.saved.header' }) }}
      </h1>
      <TreeView
        v-if="Object.keys(firmwaresTree).length > 0"
        class="bordered"
        :values="firmwaresTree"
      />
      <LoadingButton @click="() => (addVisible = true)">
        <h2>
          {{ intl.formatMessage({ id: 'ota.add.button' }) }}
        </h2>
      </LoadingButton>
    </Container>
    <Container v-if="!!runningUploads.length" :vertical="true">
      <h1 class="title">
        {{ intl.formatMessage({ id: 'ota.running.header' }) }}
      </h1>
      <OtaFirmwareUploadItem
        v-for="uploadProgress of runningUploads"
        :key="uploadProgress.taskId"
        :uploadProgress="uploadProgress"
      />
    </Container>
    <AddOtaFirmwareDialog
      v-if="addVisible"
      @close="() => (addVisible = false)"
      @created="
        () => {
          addVisible = false
          loadSaved()
        }
      "
    />
  </Container>
</template>

<style scoped>
#ota-updates {
  margin: 0 auto;
  padding: var(--default-padding);
}
</style>
