<script>
import { useIntl } from 'vue-intl'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputField from '../fields/InputField.vue'
import LoadingButton from '../controls/LoadingButton.vue'
import { toast } from '../../utils/EventBus'
import DeleteSVG from 'vue-material-design-icons/Delete.vue'
import { DashboardApi } from '../../api/gateway/DashboardApi'
import Container from '../base/Container.vue'
import { DeviceApi } from '../../api/device/DeviceApi'

export default {
  name: 'GroupEditDialog',
  components: {
    PopUpDialog,
    InputField,
    LoadingButton,
    Container,
    DeleteSVG
  },
  props: {
    group: Object
  },
  inject: ['gateway'],
  data() {
    const { device, observables, config } = JSON.parse(JSON.stringify(this.group))

    const intl = useIntl()
    return {
      sensors: {},
      states: {},
      device,
      observables,
      config,
      intl,
      loading: false,
      loadingObservables: false,
      requiredFields: {}
    }
  },
  mounted() {
    this.loadStatesAndSensors()
  },
  methods: {
    async loadStatesAndSensors() {
      this.loadingObservables = true
      try {
        this.states = Object.keys(
          (await DeviceApi.getDeviceStates(this.device, this.gateway).catch(() => {})) ?? {}
        )
        this.sensors = Object.keys(
          (await DeviceApi.getDeviceSensors(this.device, this.gateway).catch(() => {})) ?? {}
        )
      } finally {
        this.loadingObservables = false
      }
    },
    add() {
      this.observables.push({
        type: 'sensor',
        name: '',
        units: ''
      })
    },
    remove(index) {
      if (this.observables[index]) {
        this.observables.splice(index, 1)
      }
    },
    async save() {
      try {
        this.loading = true

        if (!this.validate()) {
          toast.error({
            caption: this.intl.formatMessage({ id: 'dashborad.group.edit.validation.error' })
          })
          return
        }

        const updatedGroup = {
          ...this.group,
          observables: this.observables,
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
    }
  }
}
</script>

<template>
  <PopUpDialog v-bind="$props">
    <Container :vertical="true">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'dashboard.group.edit.title' }, { name: device.name }) }}
      </h2>
      <Container :vertical="true" :gap="0">
        <Container class="table" :vertical="true">
          <div class="row">
            <h2 v-for="column of ['type', 'name', 'units', '']" :key="column">
              {{ intl.formatMessage({ id: 'dashboard.group.edit.columns' }, { column }) }}
            </h2>
          </div>
        </Container>
        <Container v-if="!loadingObservables" class="table" :vertical="true">
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
              <option v-for="obs of obs.type === 'sensor' ? sensors : states" :key="obs">
                {{ obs }}
              </option>
            </select>
            <input class="column-input" type="text" v-model="obs.units" />
            <DeleteSVG @click="remove(index)" />
          </div>
        </Container>
      </Container>
      <Container class="extra" :vertical="true">
        <LoadingButton :loading="loadingObservables" @click="add">
          <h2>
            {{ intl.formatMessage({ id: 'dashborad.group.edit.add.observables' }) }}
          </h2>
        </LoadingButton>
        <InputField 
          :label="intl.formatMessage({ id: 'dashboard.group.edit.update.delay' })"
          v-model="config.updateDelay"
          type="number"
        />
        <LoadingButton
          :loading="loading"
          @click="save"
        >
          <h2>{{ intl.formatMessage({ id: 'dashboard.group.edit.save' }) }}</h2>
        </LoadingButton>
      </Container>
    </Container>
  </PopUpDialog>
</template>

<style scoped>
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
