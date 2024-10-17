<script>
import { OtaApi } from '../../api/gateway/OtaApi';
import { toast } from '../../utils/EventBus';
import Container from '../base/Container.vue'
import InputField from '../base/fields/InputField.vue';
import ContextMenu from '../menu/ContextMenu.vue';
import EditFirmwareInfoDialog from './EditFirmwareInfoDialog.vue';
import DevicesSearchView from '../device/DevicesSearchView.vue';
import PopUpDialog from '../dialogs/PopUpDialog.vue';
import { useIntl } from 'vue-intl';
import LoadingButton from '../base/controls/LoadingButton.vue';

export default {
  name: 'OtaFirmwareItem',
  components: {
    Container,
    ContextMenu,
    EditFirmwareInfoDialog,
    InputField,
    PopUpDialog,
    DevicesSearchView,
    LoadingButton,
  },
  emits: ['updated', 'deleted', 'uploadStarted'],
  props: {
    firmware: Object
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      editVisible: false,
      searchVisible: false,
      devicesToUpload: [],
    }
  },
  computed: {
    firmwareLink() {
      return OtaApi.buildDownloadFirmwareLink(this.firmware.id)
    }
  },
  methods: {
    handleUpdated() {
      this.editVisible = false
      this.$emit("updated")
    },
    async uploadFirmware() {
      if (!this.devicesToUpload) {
        return;
      }
      this.searchVisible = false
      const names = this.devicesToUpload.map(({ name }) => name).join(", ")
      const msg = this.intl.formatMessage(
        { id: 'ota.upload.confirm' },
        {
          firmwareType: this.firmware.type,
          firmwareVersion: this.firmware.version,
          deviceName: names
        }
      )
      try {
        if (!confirm(msg)) {
          return;
        }
        const result = await OtaApi.uploadFirmware(this.firmware.id, this.devicesToUpload)
        console.log(result) // todo display errors
        toast.success({ 
          caption: this.intl.formatMessage({ id: 'ota.upload.success' }, { deviceName: names }) 
        })
        this.$emit('uploadStarted')
      } catch (error) {
        toast.error({ 
          caption: this.intl.formatMessage({ id: 'ota.upload.error' }, { deviceName: names }) 
        })
      } finally {
        this.devicesToUpload = []
      }
    },
    async deleteFirmware() {
      if (!confirm(this.intl.formatMessage({ id: 'ota.delete.confirm' }))) {
        return;
      }
      try {
        await OtaApi.deleteFirmware(this.firmware.id)
        toast.success({ caption: this.intl.formatMessage({ id: 'ota.delete.success' }) })
        this.$emit('deleted')
      } catch (error) {
        toast.error({ caption: this.intl.formatMessage({ id: 'ota.delete.error' }) })
      }
    },
  }
}
</script>

<template>
  <Container class="firmware-item">
    <h3>{{  firmware.board }}</h3>
    <ContextMenu class="context-menu">
      <p @click="() => editVisible = true">
        {{ intl.formatMessage({ id: 'ota.firmware.menu.edit' }) }}
      </p>
      <p @click="deleteFirmware">
        {{ intl.formatMessage({ id: 'ota.firmware.menu.delete' }) }}
      </p>
      <p @click="() => searchVisible = true">
        {{ intl.formatMessage({ id: 'ota.firmware.menu.upload' }) }}
      </p>
      <a :href="firmwareLink" download>
        {{ intl.formatMessage({ id: 'ota.firmware.menu.download' }) }}
      </a>
    </ContextMenu>
    <EditFirmwareInfoDialog
      v-if="editVisible"
      @close="() => editVisible = false"
      @updated="handleUpdated"
      :originalInfo="firmware"
    />
    <PopUpDialog
      v-if="searchVisible"
      @close="() => searchVisible = false"
    >
      <Container class="device-select" :vertical="true">
        <DevicesSearchView
          :title="intl.formatMessage({ id: 'ota.upload.to' })"
          :filters="{ board: firmware.board }"
          :multiple="true"
          v-model="devicesToUpload"
        />
        <LoadingButton @click="uploadFirmware">
          <h2>Upload</h2>
        </LoadingButton>
      </Container>
    </PopUpDialog>
  </Container>
</template>

<style scoped>
.firmware-item {
  position: relative;
  padding: var(--default-padding);
}
.context-menu {
  position: absolute;
  top: 5px;
  right: 0px;
}
.device-select {
  padding: var(--default-padding);
}
</style>