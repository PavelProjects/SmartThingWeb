<script>
import { DeviceApi, extractDataFromError } from '../../../api/device/DeviceApi.js'
import InputField from '../../fields/InputField.vue'
import LoadingButton from '../../controls/LoadingButton.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import CheckBoxField from '../../fields/CheckBoxField.vue'
import { useIntl } from 'vue-intl'
import { toast } from '../../../utils/EventBus.js'
import Container from '../../base/Container.vue'

export default {
  name: 'ConfigView',
  inject: ['device', 'gateway'],
  components: {
    InputField,
    CheckBoxField,
    LoadingButton,
    Container,
    SyncLoader
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      values: {},
      configInfo: {},
      loading: false,
      saveLoading: false,
      deleteLoading: false
    }
  },
  created() {
    this.update()
  },
  computed: {
    haveConfigEntries() {
      return Object.keys(this.configInfo).length !== 0
    }
  },
  methods: {
    async update() {
      this.loading = true
      try {
        await this.loadConfigInfo()
        await this.loadConfigValues()
      } finally {
        this.loading = false
      }
    },
    async loadConfigInfo() {
      try {
        this.configInfo = (await DeviceApi.getDeviceConfigInfo(this.device, this.gateway)) ?? {}
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch device configuration information'
        })
      }
    },
    async loadConfigValues() {
      try {
        this.values = (await DeviceApi.getConfig(this.device, this.gateway)) ?? {}
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to fetch device configuration values'
        })
      }
    },
    async saveConfig() {
      this.saveLoading = true
      try {
        await DeviceApi.saveConfigValues(this.device, this.values, this.gateway)
        toast.success({
          caption: 'Config updated'
        })
        this.loadConfigValues()
      } catch (error) {
        console.error(error)
        const { error: description } = await extractDataFromError(error)
        toast.error({
          caption: 'Failed to save configuration values',
          description
        })
      } finally {
        this.saveLoading = false
      }
    },
    async deleteAllValues() {
      if (confirm(this.intl.formatMessage({ id: 'device.config.delete.confirm' }))) {
        this.deleteLoading = true
        try {
          await DeviceApi.deleteAllConfigValues(this.device, this.gateway)
          toast.success({
            caption: 'Config deleted'
          })
          this.loadConfigValues()
        } catch (error) {
          console.error(error)
          const { error: description } = await extractDataFromError(error)
          toast.error({
            caption: 'Failed to delete all config values',
            description
          })
        } finally {
          this.deleteLoading = false
        }
      }
    }
  }
}
</script>

<template>
  <Container :vertical="true">
    <h1 class="title">
      {{ intl.formatMessage({ id: 'device.config.title' }) }}
    </h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <Container v-if="haveConfigEntries" class="config-inputs" :vertical="true">
      <div v-for="[key, { caption, type }] of Object.entries(this.configInfo)" :key="key">
        <CheckBoxField v-if="type === 'boolean'" :label="caption" v-model="values[key]" />
        <InputField v-else :label="caption" :type="type" v-model="values[key]" />
      </div>
    </Container>
    <Container class="controls-holder" :gap="'10px'">
      <LoadingButton class="delete" :loading="deleteLoading" @click="deleteAllValues">
        <h2>{{ intl.formatMessage({ id: 'device.config.button.delete.all' }) }}</h2>
      </LoadingButton>
      <LoadingButton :loading="saveLoading" @click="saveConfig">
        <h2>{{ intl.formatMessage({ id: 'device.config.button.save' }) }}</h2>
      </LoadingButton>
    </Container>
    <h2 v-if="!haveConfigEntries" class="title">
      {{ intl.formatMessage({ id: 'device.config.empty.entries' }) }}
    </h2>
  </Container>
</template>

<style scoped>
h2 {
  text-align: center;
}
.controls-holder {
  flex: 1 0 auto;
}
.controls-holder button {
  width: 50%;
}
.config-inputs {
  padding-bottom: calc(40px + var(--default-gap));
  width: 60%;
  margin: auto;
}
.delete {
  background-color: var(--color-danger);
}
</style>
