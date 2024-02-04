<script>
import { toast } from '../../utils/EventBus'
import LoadingButton from '../controls/LoadingButton.vue'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputWithLabel from '../fields/InputWithLabel.vue'

export default {
  name: 'GatewayEditDialog',
  components: {
    PopUpDialog,
    InputWithLabel,
    LoadingButton
  },
  props: {
    gateway: Object
  },
  data() {
    const { name, description } = this.gateway || {}
    return { name, description }
  },
  computed: {
    buttonTitle() {
      const { id } = this.gateway || {}
      return id ? 'Update' : 'Create'
    }
  },
  methods: {
    handleSave() {
      if (!this.name) {
        toast.error({
          caption: "Gateway name can't be blank!"
        })
        return
      }
      if (this.name.length > 32) {
        toast.error({
          caption: 'Name is too long!',
          description: 'Max name length - 32 symbols'
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
  <PopUpDialog>
    <InputWithLabel label="Name" :value="name" @input="(event) => (name = event.target.value)" />
    <InputWithLabel
      label="Description"
      :value="description"
      @input="(event) => (description = event.target.value)"
    />
    <LoadingButton @click.stop="handleSave">
      {{ buttonTitle }}
    </LoadingButton>
  </PopUpDialog>
</template>
