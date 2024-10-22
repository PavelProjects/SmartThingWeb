<script>
import { useIntl } from 'vue-intl'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputField from '../base/fields/InputField.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'
import { toast } from '../../utils/EventBus'
import DeleteSVG from 'vue-material-design-icons/Delete.vue'
import { DashboardApi } from '../../api/gateway/DashboardApi'
import BaseContainer from '../base/BaseContainer.vue'
import { DeviceApi } from '../../api/device/DeviceApi'

export default {
  name: 'GroupEditDialog',
  components: {
    PopUpDialog,
    InputField,
    LoadingButton,
    BaseContainer,
    DeleteSVG
  },
  props: {
    group: Object
  },
  inject: ['gateway'],
  emits: ['close'],
  data() {
    const { device, observables, actions, config } = JSON.parse(JSON.stringify(this.group))

    const intl = useIntl()
    return {
      info: {
        sensors: [],
        states: [],
        actions: undefined
      },
      device,
      observables,
      actions,
      config,
      intl,
      loading: false,
      loadingObservables: false,
      loadingActions: false,
      requiredFields: {}
    }
  },
  mounted() {
    this.loadStatesAndSensors()
    this.loadActions()
  },
  methods: {
    async loadStatesAndSensors() {
      this.loadingObservables = true
      try {
        this.info.states = Object.keys(
          (await DeviceApi.getDeviceStates(this.device, this.gateway).catch(() => {})) ?? {}
        )
        this.info.sensors = Object.keys(
          (await DeviceApi.getDeviceSensors(this.device, this.gateway).catch(() => {})) ?? {}
        )
      } finally {
        this.loadingObservables = false
      }
    },
    async loadActions() {
      this.loadingActions = true
      try {
        this.info.actions = await DeviceApi.getDeviceActionsInfo(this.device, this.gateway)
      } finally {
        this.loadingActions = false
      }
    },
    async save() {
      try {
        this.loading = true

        if (!this.validate()) {
          toast.error({
            caption: this.intl.formatMessage({ id: 'dashboard.group.edit.validation.error' })
          })
          return
        }

        const updatedGroup = {
          ...this.group,
          observables: this.observables,
          actions: this.actions,
          config: this.config
        }
        await DashboardApi.updateGroup(updatedGroup, this.gateway)
        this.$emit('close', true)
        toast.success({
          caption: this.intl.formatMessage({ id: 'dashboard.group.edit.success' })
        })
      } catch (error) {
        console.error(error)
        toast.success({
          caption: this.intl.formatMessage({ id: 'dashboard.group.edit.error' })
        })
      } finally {
        this.loading = false
      }
    },
    validate() {
      this.requiredFields = {}
      this.observables.forEach(({ name, type }, index) => {
        if (!name || !type) {
          this.requiredFields[index] = {
            name: !name,
            type: !type
          }
        }
      })
      return !Object.keys(this.requiredFields).length
    },
    clearRequired(index, field) {
      if (this.requiredFields[index]) {
        this.requiredFields[index][field] = false
      }
    },
    handleClose() {
      if (confirm(this.intl.formatMessage({ id: 'dashboard.group.edit.close.confirm' }))) {
        this.$emit('close')
      }
    }
  }
}
</script>

<template>
  <PopUpDialog @close="handleClose">
    <BaseContainer :vertical="true">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'dashboard.group.edit.title' }, { name: device.name }) }}
      </h2>
      <BaseContainer :vertical="true">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'dashboard.group.edit.observables' }) }}
        </h2>
        <BaseContainer :vertical="true" :gap="'0px'">
          <BaseContainer class="table" :vertical="true">
            <div class="row">
              <h2 v-for="column of ['type', 'name', 'units', '']" :key="column">
                {{ intl.formatMessage({ id: 'dashboard.group.edit.columns' }, { column }) }}
              </h2>
            </div>
          </BaseContainer>
          <BaseContainer
            v-if="!loadingObservables && observables.length"
            class="table"
            :vertical="true"
          >
            <div v-for="(obs, index) of observables" :key="index" class="row">
              <select
                class="column-input"
                v-model="obs.type"
                @change="
                  () => {
                    obs.name = ''
                    clearRequired(index, 'type')
                  }
                "
                :class="{ required: requiredFields[index]?.type ?? false }"
              >
                <option v-for="value of ['sensor', 'state']" :key="value" :value="value">
                  {{ intl.formatMessage({ id: 'dashboard.group.edit.types' }, { value }) }}
                </option>
              </select>
              <select
                class="column-input"
                v-model="obs.name"
                @change="clearRequired(index, 'name')"
                :class="{ required: requiredFields[index]?.name ?? false }"
              >
                <option
                  v-for="obs of obs.type === 'sensor' ? info.sensors : info.states"
                  :key="obs"
                >
                  {{ obs }}
                </option>
              </select>
              <input class="column-input" type="text" v-model="obs.units" />
              <DeleteSVG @click="() => observables.splice(index, 1)" />
            </div>
          </BaseContainer>
        </BaseContainer>
        <LoadingButton
          :loading="loadingObservables"
          @click="() => observables.push({ type: 'sensor', name: '', units: '' })"
        >
          <h2>
            {{ intl.formatMessage({ id: 'dashboard.group.edit.add.observables' }) }}
          </h2>
        </LoadingButton>
      </BaseContainer>
      <BaseContainer v-if="info.actions" :vertical="true">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'dashboard.group.edit.actions' }) }}
        </h2>
        <BaseContainer v-if="!loadingActions && actions" :vertical="true">
          <BaseContainer v-for="(action, index) of actions" :key="action">
            <select
              class="action-select"
              :value="action"
              @input="actions[index] = $event.target.value"
            >
              <option
                v-for="[action, caption] of Object.entries(info.actions)"
                :key="action"
                :value="action"
              >
                {{ caption }}
              </option>
            </select>
            <DeleteSVG @click="() => actions.splice(index, 1)" />
          </BaseContainer>
        </BaseContainer>
        <LoadingButton
          :loading="loadingActions"
          @click="() => actions.push(Object.keys(info.actions)[0])"
        >
          <h2>
            {{ intl.formatMessage({ id: 'dashboard.group.edit.add.action' }) }}
          </h2>
        </LoadingButton>
      </BaseContainer>
      <BaseContainer class="extra" :vertical="true">
        <h2 class="header">
          {{ intl.formatMessage({ id: 'dashboard.group.edit.config' }) }}
        </h2>
        <InputField
          :label="intl.formatMessage({ id: 'dashboard.group.edit.update.delay' })"
          v-model="config.updateDelay"
          type="number"
        />
        <LoadingButton :loading="loading" @click="save">
          <h2>{{ intl.formatMessage({ id: 'dashboard.group.edit.save' }) }}</h2>
        </LoadingButton>
      </BaseContainer>
    </BaseContainer>
  </PopUpDialog>
</template>

<style scoped>
.header {
  margin: auto;
}
.table {
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
  border-top: 1px solid var(--color-border);
}
.row {
  display: grid;
  grid-template-columns: 100px 200px 100px 50px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  word-wrap: break-word;
}
.row * {
  border-right: 1px solid var(--color-border);
}
.row *:last-child {
  border-right: none;
}
.column-input {
  text-align: center;
  border: none;
  border-radius: 0px;
  border-right: 1px solid var(--color-border);
}
.action-select {
  flex: 1 0 auto;
}
.material-design-icon {
  width: fit-content;
  height: fit-content;
  margin: auto;
  cursor: pointer;
}
.required {
  background-color: var(--color-danger);
}
.extra {
  padding: var(--default-gap);
}
</style>
