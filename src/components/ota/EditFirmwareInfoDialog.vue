<script>
import { OtaApi } from '../../api/gateway/OtaApi';
import { toast } from '../../utils/EventBus';
import Container from '../base/Container.vue'
import InputField from '../base/fields/InputField.vue';
import ComboBoxField from '../base/fields/ComboBoxField.vue';
import LoadingButton from '../controls/LoadingButton.vue';
import PopUpDialog from '../dialogs/PopUpDialog.vue';
import { useIntl } from 'vue-intl';

export default {
  name: 'EditFirmwareInfoDialog',
  components: {
    Container,
    PopUpDialog,
    InputField,
    ComboBoxField,
    LoadingButton,
  },
  emits: ['updated'],
  props: {
    originalInfo: Object
  },
  data() {
    const intl = useIntl()
    const { board, type, version } = this.originalInfo;
    return {
      intl,
      supportedBoards: [],
      info: { board, type, version }
    }
  },
  async mounted() {
    try {
      this.supportedBoards = await OtaApi.getSupportedBoards()
    } catch (error) {
      toast.error({ caption: this.intl.formatMessage({ id: 'ota.add.supported.error' })})
    }
  },
  methods: {
    async save() {
      const { board, type, version } = this.info;
      if (!board || !type || !version) {
        return;
      }
      try {
        await OtaApi.updateFirmware({ id: this.originalInfo.id, board, type, version });
        toast.success({ caption: this.intl.formatMessage({ id: 'ota.edit.succes' }) })
        this.$emit("updated")
      } catch (error) {
        toast.error({ caption: this.intl.formatMessage({ id: 'ota.edit.error' }) })
      }
    }
  }
}
</script>

<template>
  <PopUpDialog v-bind="$attrs">
    <Container :vertical="true" class="edit-firmware">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'ota.edit.header' }) }}
      </h2>
      <ComboBoxField
        :label="intl.formatMessage({ id: 'ota.firmware.info.board' })"
        v-model="info.board"
        :items="supportedBoards"
        :validationFailed="!info.board"
      />
      <InputField
        :label="intl.formatMessage({ id: 'ota.firmware.info.type' })"
        label="Type"
        v-model="info.type"
        :validationFailed="!info.type"
      />
      <InputField
        :label="intl.formatMessage({ id: 'ota.firmware.info.version' })"
        label="Version"
        v-model="info.version"
        :validationFailed="!info.version"
      />
      <LoadingButton @click="save">
        <h2>
          {{ intl.formatMessage({ id: 'ota.edit.button' }) }}
        </h2>
      </LoadingButton>
    </Container>
  </PopUpDialog>
</template>

<style scoped>
  .edit-firmware {
    padding: var(--default-padding);
  }
</style>