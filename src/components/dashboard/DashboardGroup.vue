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
import UpdateButton from '../controls/UpdateButton.vue';

export default {
  components: { 
    DashboardValue,
    ContextMenu,
    GroupEditDialog,
    LoadingButton,
    UpdateButton
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
      updateDelay: this.group?.config?.updateDelay || 60,
      count: 0,
      loading: false,
      values: {},
      intervalId: -1,
      editing: false,
      ...this.group
    }
    // todo INTL!!!
  },
  mounted() {
    this.countTimer()
    this.firstFetch()
    this.intervalId = setInterval(this.updateValues, this.updateDelay * 1000)
  },
  unmounted() {
    clearInterval(this.intervalId)
  },
  computed: {
    updateTitle() {
      return `Click to force update\nAuto update every ${this.updateDelay}s\nLast update ${this.count}s ago`
    },
    deviceTitle() {
      return `Group for device:\nname: ${this.device.name}\nip: ${this.device.ip}`
    }
  },
  methods: {
    async firstFetch() {
      this.loading = true;
      try {
        const { updateDeviceConfig } = useDashboardStore()
        updateDeviceConfig(this.group, {
          sensors: Object.keys(await this.updateSensors()),
          states: Object.keys(await this.updateStates()),
        })
      } finally {
        this.count = 0
        this.loading = false
      }
    },
    async updateValues() {
      this.loading = true
      try {
        if (this.observables.find(({ type }) => type === 'sensor')) {
          await this.updateSensors()
        }
        if (this.observables.find(({ type }) => type === 'state')) {
          await this.updateStates()
        }
        // todo catch error
      } finally {
        this.count = 0
        this.loading = false
      }
    },
    countTimer() {
      setTimeout(() => {
        this.count += 2;
        this.countTimer()
      }, 2000)
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
      <UpdateButton 
        class="update"
        :title="updateTitle"
        :loading="loading"
        :onClick="updateValues"
      />
      <h2
        class="title"
        :title="deviceTitle"
      >
        {{ group.device.name }}
      </h2>
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
  .update {
    position: absolute;
    top: 2px;
    left: 2px;
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