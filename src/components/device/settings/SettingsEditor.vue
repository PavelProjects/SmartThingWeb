<script>
import { GatewayApi } from '../../../api/GatewayApi';
  import { toast } from '../../../utils/EventBus';
import LoadingButton from '../../controls/LoadingButton.vue';
import InputWithLabel from '../../fields/InputWithLabel.vue'
  export default {
    name: "SettingsEditor",
    components: { InputWithLabel, LoadingButton },
    props: {
      name: String,
      settings: String,
    },
    data() {
      return {
        settingsName: this.name,
        deviceSettings: this.settings,
        loading: false,
      }
    },
    methods: {
      async save() {
        let valid = true
        if (this.settingsName.length === 0) {
          toast.error({
            caption: "Name can't be empty!",
            description: "Insert settings name"
          })
          valid = false
        }
        if (this.deviceSettings.length === 0) {
          toast.error({
            caption: "Settings can't be empty!",
            description: "Insert settings json"
          })
          valid = false
        }
        if (!valid) {
          return
        }
        this.loading = true
        try {
          let res = false;
          if (this.name) {
            res = await GatewayApi.updateDeviceSettings({
              oldName: this.name,
              name: this.settingsName,
              settings: this.deviceSettings
            })
          } else {
            res = await GatewayApi.createDeviceSettings({ 
              name: this.settingsName,
              settings: this.deviceSettings
            })
          }
          if (res) {
            toast.success({ caption: "Settings saved" })
            this.$emit("updateTabs")
          }
        } finally {
          this.loading = false
        }
      },
      async deleteSettings() {
        if (!confirm("This action will delete saved settings permanently. Are you sure?")) {
          return;
        }
        if (await GatewayApi.deleteDeviceSettings(this.name)) {
          toast.success({ caption: "Settings deleted" })
          this.$emit("updateTabs")
        }
      }
    }
  }
</script>

<template>
  <div id="devices-settings" class="list">
    <InputWithLabel
      label="Name"
      :value="name"
      @input="settingsName = $event.target.value"
    />
    <h2 class="title">Settings</h2>
    <textarea v-model="deviceSettings"></textarea>
    <div class="controls">
      <LoadingButton @click="save" :loading="loading">
        <h2>{{ name ? "Update" : "Create" }}</h2>
      </LoadingButton>
      <LoadingButton v-if="name" @click="deleteSettings" class="delete">
        <h2>Delete</h2>
      </LoadingButton>
    </div>
  </div>
</template>

<style scoped>
  textarea {
    font-size: 20px;
    min-width: 500px;
    min-height: 200px;
  }
  .delete {
    background-color: var(--color-danger);
  }
  .controls {
    display: flex;
    flex-direction: row;
    gap: var(--default-gap)
  }
  .controls button {
    flex: 1 0 auto;
  }
</style>