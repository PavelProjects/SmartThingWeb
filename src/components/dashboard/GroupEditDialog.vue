<script>
import { useIntl } from 'vue-intl'
import PopUpDialog from '../dialogs/PopUpDialog.vue'
import InputField from '../fields/InputField.vue'
import { useDashboardStore } from '../../store/dashboardStore'
import LoadingButton from '../controls/LoadingButton.vue'
import { toast } from '../../utils/EventBus'
import DeleteSVG from 'vue-material-design-icons/Delete.vue'
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import { DashboardApi } from '../../api/DashboardApi'

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
    const { deviceConfig } = useDashboardStore()
    const { sensors, states } = deviceConfig[this.group.id] || {}
    const { device, observables } = JSON.parse(JSON.stringify(this.group))

    const intl = useIntl()
    return {
      device,
      observables,
      sensors,
      states,
      intl,
      loading: false,
      haveChanges: false,
      newObs: { type: 'sensor' },
    }
  },
  methods: {
    add() {
      const { type, name, units } = this.newObs
      if (type && name) {
        this.observables.push({ type, name, units })
        this.newObs = { type: 'sensor' }
        this.haveChanges = true
      }
    },
    remove(index) {
      if (this.observables[index]) {
        this.observables.splice(index, 1)
        this.haveChanges = true
      }
    },
    async save() {
      try {
        this.loading = true
        await DashboardApi.updateGroupObservables(this.group.id, this.observables)
        this.$emit('close', true)
        toast.success({ caption: "Group saved" })
      } catch (error) {
        console.error(error)
        toast.error({ caption: "Failed to save group" })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<template>
  <PopUpDialog v-bind="$props">
    <div class="list">
      <h2 class="title">
        {{ intl.formatMessage({ id: 'dashboard.group.edit.title' }, { name: device.name }) }}
      </h2>
      <div class="values">
        <h2>type</h2>
        <h2>name</h2>
        <h2>units</h2>
        <h2></h2>
      </div>
      <div class="content">
        <div
          v-for="obs, index of observables"
          :key="index"
          class="values"
        >
          <h2>{{ obs.type }}</h2>
          <h2>{{ obs.name }}</h2>
          <input
            class="units-input"
            type="text"
            v-model="obs.units"
            @change="haveChanges = true"
          />
          <DeleteSVG 
            @click="remove(index)"
          />
        </div>
      </div>
      <div class="values">
        <select
          class="units-input"
          v-model="newObs.type"
          @change="newObs.name = ''"
        >
          <option>sensor</option>
          <option>state</option>
        </select>
        <select
          class="units-input"
          v-model="newObs.name"
        >
          <option
            v-for="state of newObs.type === 'sensor' ? sensors : states"
            :key="state"
          >{{ state }}</option>
        </select>
        <input
          class="units-input"
          type="text"
          v-model="newObs.units"
        />
        <PlusSVG @click="add"/>
      </div>
      <LoadingButton
        v-if="haveChanges"
        :loading="loading"
        @click="save"
      >
        <h2>Save</h2>
      </LoadingButton>
    </div>
  </PopUpDialog>
</template>

<style scoped>
  .content {
    display: flex;
    flex-direction: column;
    gap: var(--default-gap);
    max-height: 50vh;
    overflow-y: auto;
    overflow-x: hidden;
  }
  .values {
    display: grid;
    grid-template-columns: 100px 200px 100px 50px;
    text-align: center;
    border-bottom: 1px solid var(--color-border);
  }
  .values * {
    border-right: 1px solid var(--color-border);
  }
  .values *:last-child {
    border-right: none;
  }
  .units-input {
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