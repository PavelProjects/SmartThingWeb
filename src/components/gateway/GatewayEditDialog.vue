<script>
import { useIntl } from 'vue-intl'
import { toast } from '../../utils/EventBus'
import LoadingButton from '../base/controls/LoadingButton.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputField from '../base/fields/InputField.vue'
import Container from '../base/Container.vue'

const NAME_MAX_LENGTH = 32

export default {
  name: 'GatewayEditDialog',
  components: {
    PopUpDialog,
    InputField,
    LoadingButton,
    Container
  },
  props: {
    gateway: Object
  },
  data() {
    const { name, description } = this.gateway || {}
    const intl = useIntl()
    return { name, description, intl }
  },
  computed: {
    buttonTitle() {
      const { id } = this.gateway || {}
      return this.intl.formatMessage(
        { id: 'gateway.edit.button' },
        { action: id ? 'update' : 'create' }
      )
    }
  },
  methods: {
    handleSave() {
      if (!this.name) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.edit.validation.name.blank' })
        })
        return
      }
      if (this.name.length > NAME_MAX_LENGTH) {
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.edit.validation.name.long' }),
          description: this.intl.formatMessage(
            { id: 'gateway.edit.validation.name.desc' },
            { len: NAME_MAX_LENGTH }
          )
        })
      }
      const { id } = this.gateway || {}
      this.$emit('save', {
        id,
        name: this.name,
        description: this.description
      })
    }
  }
}
</script>

<template>
  <PopUpDialog @close="$emit('close')">
    <Container class="gateway-editor" :vertical="true">
      <InputField :label="intl.formatMessage({ id: 'gateway.edit.name' })" v-model="name" />
      <InputField
        :label="intl.formatMessage({ id: 'gateway.edit.description' })"
        v-model="description"
      />
      <LoadingButton @click="handleSave">
        <h2>{{ buttonTitle }}</h2>
      </LoadingButton>
    </Container>
  </PopUpDialog>
</template>

<style scoped>
.gateway-editor {
  padding: var(--default-padding);
}
</style>
