<script>
import { useIntl } from 'vue-intl'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputField from '../fields/InputField.vue'
import { useDashboardStore } from '../../store/dashboardStore'
import LoadingButton from '../controls/LoadingButton.vue'
import { toast } from '../../utils/EventBus'
import DeleteSVG from 'vue-material-design-icons/Delete.vue'
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import { DashboardApi } from '../../api/gateway/DashboardApi'
import { useGatewayStore } from '../../store/gatewayStore'
import { storeToRefs } from 'pinia'

export default {
  name: 'GroupEditDialog',
  components: {
    PopUpDialog,
    InputField,
    LoadingButton,
    DeleteSVG,
    PlusSVG,
  },
  props: {
    group: Object
  },
  data() {
    const { gateway } = storeToRefs(useGatewayStore())
    const { deviceConfig } = useDashboardStore()
    const { sensors, states } = deviceConfig[this.group.id] || {}
    const { device, observables, config } = JSON.parse(JSON.stringify(this.group))

    const intl = useIntl()
    return {
      device,
      observables,
      config,
      sensors,
      states,
      intl,
      gateway,
      loading: false,
      newObs: { type: 'sensor' }
    }
  },
  methods: {
    add() {
      const { type, name, units } = this.newObs
      if (type && name) {
        this.observables.push({ type, name, units })
        this.newObs = { type: 'sensor' }
      }
    },
    remove(index) {
      if (this.observables[index]) {
        this.observables.splice(index, 1)
      }
    },
    async save() {
      try {
        this.loading = true
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
    }
  }
}
</script>

<template>
  <PopUpDialog v-bind="$props">
    <div class="content">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'dashboard.group.edit.title' }, { name: device.name }) }}
      </h2>
      <div class="table">
        <div class="row">
          <h2 v-for="column of ['type', 'name', 'units', '']" :key="column">
            {{ intl.formatMessage({ id: 'dashboard.group.edit.columns' }, { column }) }}
          </h2>
        </div>
        <div
          v-for="obs, index of observables"
          :key="index"
          class="row"
        >
          <h2>{{ intl.formatMessage({ id: 'dashboard.group.edit.types' }, { value: obs.type }) }}</h2>
          <h2>{{ obs.name }}</h2>
          <input
            class="column-input"
            type="text"
            v-model="obs.units"
          />
          <DeleteSVG @click="remove(index)"/>
        </div>
        <div class="row">
          <select
            class="column-input"
            v-model="newObs.type"
            @change="newObs.name = ''"
          >
            <option
              v-for="value of ['sensor', 'state']"
              :key="value"
              :value="value"
            >
              {{ intl.formatMessage({ id: 'dashboard.group.edit.types' }, { value }) }}
            </option>
          </select>
          <select
            class="column-input"
            v-model="newObs.name"
          >
            <option
              v-for="obs of newObs.type === 'sensor' ? sensors : states"
              :key="obs"
            >{{ obs }}</option>
          </select>
          <input
            class="column-input"
            type="text"
            v-model="newObs.units"
          />
          <PlusSVG @click="add"/>
        </div>
      </div>
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
    </div>
  </PopUpDialog>
</template>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .table {
    display: flex;
    flex-direction: column;
    gap: var(--default-gap);
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
</style>