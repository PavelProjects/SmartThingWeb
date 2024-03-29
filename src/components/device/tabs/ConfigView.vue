<script>
import { DeviceApi } from '../../../api/device/DeviceApi.js'
import InputField from '../../fields/InputField.vue'
import LoadingButton from '../../controls/LoadingButton.vue'
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
import CheckBoxField from '../../fields/CheckBoxField.vue'
import { useIntl } from 'vue-intl'

export default {
  name: 'ConfigView',
  inject: ['device', 'gateway'],
  components: {
    InputField,
    CheckBoxField,
    LoadingButton,
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
      this.configInfo = await DeviceApi.getDeviceConfigInfo(this.device, this.gateway) ?? {}
    },
    async loadConfigValues() {
      this.values = await DeviceApi.getConfig(this.device, this.gateway) ?? {}
    },
    async saveConfig() {
      this.saveLoading = true
      try {
        if (await DeviceApi.saveConfigValues(this.device, this.values, this.gateway)) {
          this.loadConfigValues()
        }
      } finally {
        this.saveLoading = false
      }
    },
    async deleteAllValues() {
      if (confirm(this.intl.formatMessage({ id: 'device.config.delete.confirm' }))) {
        this.deleteLoading = true
        try {
          if (await DeviceApi.deleteAllConfigValues(this.device, this.gateway)) {
            this.loadConfigValues()
          }
        } finally {
          this.deleteLoading = false
        }
      }
    },
  }
}
</script>

<template>
  <div>
    <h1 class="title">
      {{ intl.formatMessage({ id: 'device.config.title' }) }}
    </h1>
    <sync-loader class="loading-spinner" :loading="loading"></sync-loader>
    <div v-if="haveConfigEntries" class="config-inputs list">
      <div
        v-for="[key, { caption, type }] of Object.entries(this.configInfo)"
        :key="key"
      >
        <CheckBoxField
          v-if="type === 'boolean'"
          :label="caption"
          v-model="values[key]"
        />
        <InputField
          v-else
          :label="caption"
          :type="type"
          v-model="values[key]"
        />
      </div>
      <div class="controls-holder">
        <LoadingButton class="delete" :loading="deleteLoading" @click="deleteAllValues">
          <h2>{{ intl.formatMessage({ id: 'device.config.button.delete.all' }) }}</h2>
        </LoadingButton>
        <LoadingButton :loading="saveLoading" @click="saveConfig">
          <h2>{{ intl.formatMessage({ id: 'device.config.button.save' }) }}</h2>
        </LoadingButton>
      </div>
    </div>
    <h2 v-else class="title">
      {{ intl.formatMessage({ id: 'device.config.empty.entries' }) }}
    </h2>
  </div>
</template>

<style scoped>
h2 {
  text-align: center;
}
.controls-holder {
  position: absolute;
  bottom: 0px;
  width: 100%;
  display: flex;
  flex-direction: row;
  gap: var(--default-gap);
}
.controls-holder button {
  width: 50%;
}
.config-inputs {
  padding-bottom: calc(40px + var(--default-gap));
}
.delete {
  background-color: var(--color-danger);
}
</style>
