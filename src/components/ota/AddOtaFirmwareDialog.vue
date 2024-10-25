<script>
import { OtaApi } from '../../api/gateway/OtaApi'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import InputField from '../base/fields/InputField.vue'
import ComboBoxField from '../base/fields/ComboBoxField.vue'
import { toast } from '../../utils/EventBus'
import FileField from '../base/fields/FileField.vue'
import ModalDialog from '../base/ModalDialog.vue'
import { useIntl } from 'vue-intl'
import { extractDataFromError } from '../../api/ApiUtils'

export default {
  name: 'AddOtaFirmwareDialog',
  components: {
    BaseContainer,
    LoadingButton,
    InputField,
    FileField,
    ComboBoxField,
    ModalDialog
  },
  emits: ['created'],
  data() {
    const intl = useIntl()
    return {
      intl,
      loading: false,
      supportedBoards: [],
      info: {
        board: undefined,
        type: undefined,
        version: undefined
      },
      files: undefined
    }
  },
  async mounted() {
    try {
      this.supportedBoards = await OtaApi.getSupportedBoards()
    } catch (error) {
      toast.error({ caption: this.intl.formatMessage({ id: 'ota.add.supported.error' }) })
    }
  },
  methods: {
    async addFirmware() {
      if (!this.info.board || !this.info.type || !this.info.version || !this.files[0]) {
        return
      }
      this.loading = true
      try {
        await OtaApi.addFirmware(this.info, this.files[0])
        toast.success({ caption: this.intl.formatMessage({ id: 'ota.add.success' }) })
        this.$emit('created')
      } catch (error) {
        const data = extractDataFromError(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'ota.add.error' }),
          description: data?.message
        })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <ModalDialog v-bind="$attrs">
    <BaseContainer :vertical="true" id="add-firmware">
      <h2 class="header">
        {{ intl.formatMessage({ id: 'ota.add.header' }) }}
      </h2>
      <ComboBoxField
        :label="intl.formatMessage({ id: 'ota.firmware.info.board' })"
        v-model="info.board"
        :items="supportedBoards"
        :validationFailed="!info.board"
      />
      <InputField
        :label="intl.formatMessage({ id: 'ota.firmware.info.type' })"
        v-model="info.type"
        :validationFailed="!info.type"
      />
      <InputField
        :label="intl.formatMessage({ id: 'ota.firmware.info.version' })"
        v-model="info.version"
        :validationFailed="!info.version"
      />
      <FileField
        :label="intl.formatMessage({ id: 'ota.firmware.info.file' })"
        accept=".bin"
        v-model="files"
        :validationFailed="!files"
      />
      <LoadingButton @click="addFirmware" :loading="loading">
        <h2>
          {{ intl.formatMessage({ id: 'ota.add.button' }) }}
        </h2>
      </LoadingButton>
    </BaseContainer>
  </ModalDialog>
</template>

<style>
#add-firmware {
  padding: var(--default-padding);
}
</style>
