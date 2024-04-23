<script>
import { DeviceApi } from '../../api/device/DeviceApi'
import DashboardValue from './DashboardValue.vue'
import ContextMenu from '../menu/ContextMenu.vue';
import GroupEditDialog from './GroupEditDialog.vue';
import { useIntl } from 'vue-intl';
import { useDashboardStore } from '../../store/dashboardStore';
import LoadingButton from '../controls/LoadingButton.vue';
import { DashboardApi } from '../../api/DashboardApi';
import { toast } from '../../utils/EventBus';

export default {
  components: { 
    DashboardValue,
    ContextMenu,
    GroupEditDialog,
    LoadingButton
  },
  name: 'DashboardGroup',
  emits: ['updateGroups'],
  props: {
    group: Object,
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      values: {},
      intervalId: -1,
      editing: false,
      ...this.group
    }
  },
  mounted() {
    this.firstFetch()
    this.intervalId = setInterval(this.updateValues, 60000)
  },
  unmounted() {
    clearInterval(this.intervalId)
  },
  methods: {
    async firstFetch() {
      const { updateDeviceConfig } = useDashboardStore()
      updateDeviceConfig(this.group, {
        sensors: Object.keys(await this.updateSensors()),
        states: Object.keys(await this.updateStates()),
      })
    },
    updateValues() {
      if (this.observables.find(({ type }) => type === 'sensor')) {
        this.updateSensors()
      }
      if (this.observables.find(({ type }) => type === 'state')) {
        this.updateStates()
      }
    },
    async updateSensors() {
      return DeviceApi.getDeviceSensors(this.device).then((sensors) => {
        Object.entries(sensors).forEach(([name, {value}]) => {
          this.values['sensor' + name] = value
        })
        return sensors
      })
    },
    async updateStates() {
      return DeviceApi.getDeviceStates(this.device).then((states) => {
        Object.entries(states).forEach(([name, value]) => {
          this.values['state' + name] = value
        })
        return states
      })
    },
    async deleteGroup() {
      if (confirm("Are you sure?")) {
        try {
          await DashboardApi.deleteGroup(this.group.id)
          toast.success({ caption: "Group deleted" })
          this.$emit('updateGroups')
        } catch (error) {
          console.log(error)
          toast.error({ caption: "Failed to delete group" })
        }
      }
    },
    handleEditClose(result) {
      if (result) {
        this.$emit('updateGroups')
      }
      this.editing = false
    }
  }
}
</script>

<template>
  <div>
    <div class="dashboard-group bordered">
      <h2 class="title" :title="group.device.ip">{{ group.device.name }}</h2>
      <ContextMenu class="context-menu">
        <p @click.stop="editing = true">
          {{ intl.formatMessage({ id: 'dashboard.group.edit' }) }}
        </p>
        <p @click.stop="deleteGroup">
          Delete group
        </p>
      </ContextMenu>
      <div v-if="observables.length > 0" class="values">
        <DashboardValue
          v-for="{ name, type, units }, index of observables"
          :key="index"
          :type="type"
          :name="name"
          :value="values[type+name] || 'Nan'"
          :units="units"
        />
      </div>
      <div v-else>
        <LoadingButton @click="editing = true">
          <h2>Add values to display</h2>
        </LoadingButton>
      </div>
    </div>
    <GroupEditDialog 
      v-if="editing"
      :group="group"
      @close="handleEditClose"
    />
  </div>
</template>

<style scoped>
  .dashboard-group {
    display: flex;
    flex-direction: column;
    gap: var(--default-gap);
    padding: 2px;
    position: relative;
  }
  .dashboard-group .title {
    border-bottom: 2px solid var(--color-border);
  }
  .values {
    display: flex;
    flex-direction: row;
    gap: var(--default-gap);
  }
  .values * {
    border-right: 2px solid var(--color-border);
  }
  .values *:last-child {
    border-right: none;
  }
  .context-menu {
    position: absolute;
    top: 5px;
    right: 0px;
  }
  .field-container {
    display: flex;
  }
</style>