<script>
import { DeviceApi } from '../../api/device/DeviceApi'
import DashboardValue from './DashboardValue.vue'
import ContextMenu from '../menu/ContextMenu.vue';
import GroupEditDialog from './GroupEditDialog.vue';
import { useIntl } from 'vue-intl';
import { useDashboardStore } from '../../store/dashboardStore';
import LoadingButton from '../controls/LoadingButton.vue';
import { DashboardApi } from '../../api/gateway/DashboardApi';
import { toast } from '../../utils/EventBus';
import UpdateButton from '../controls/UpdateButton.vue';
import { useGatewayStore } from '../../store/gatewayStore';
import { storeToRefs } from 'pinia';
import Container from '../base/Container.vue';

export default {
  components: { 
    DashboardValue,
    ContextMenu,
    GroupEditDialog,
    LoadingButton,
    UpdateButton,
    Container,
  },
  name: 'DashboardGroup',
  emits: ['updateGroups'],
  props: {
    group: Object,
  },
  data() {
    const { gateway } = storeToRefs(useGatewayStore())
    const intl = useIntl()
    return {
      intl,
      updateDelay: this.group?.config?.updateDelay || 60,
      count: 0,
      loading: false,
      values: {},
      intervalId: -1,
      editing: false,
      gateway,
      ...this.group
    }
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
      return this.intl.formatMessage(
        { id: 'dashboard.group.update.title' },
        { updateDelay: this.updateDelay, count: this.count }
      )
    },
    deviceTitle() {
      return this.intl.formatMessage({ id: 'dashboard.group.device.title' }, this.device)
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
      return DeviceApi.getDeviceSensors(this.device, this.gateway).then((sensors) => {
        Object.entries(sensors).forEach(([name, {value}]) => {
          this.values['sensor' + name] = value
        })
        return sensors
      })
    },
    async updateStates() {
      return DeviceApi.getDeviceStates(this.device, this.gateway).then((states) => {
        Object.entries(states).forEach(([name, value]) => {
          this.values['state' + name] = value
        })
        return states
      })
    },
    async deleteGroup() {
      if (confirm(this.intl.formatMessage({ id: 'dashboard.group.delete.confirm' }))) {
        try {
          await DashboardApi.deleteGroup(this.group.id, this.gateway)
          toast.success({
            caption: this.intl.formatMessage({ id: 'dashboard.group.delete.success' })
          })
          this.$emit('updateGroups')
        } catch (error) {
          console.log(error)
          toast.error({
            caption: this.intl.formatMessage({ id: 'dashboard.group.delete.error' })
          })
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
    <Container class="dashboard-group bordered" :vertical="true">
      <UpdateButton
        v-if="observables.length > 0"
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
          {{ intl.formatMessage({ id: 'dashboard.group.delete' }) }}
        </p>
      </ContextMenu>
      <Container class="values">
        <DashboardValue
          v-for="{ name, type, units }, index of observables"
          :key="index"
          :type="type"
          :name="name"
          :value="values[type+name] || 'Nan'"
          :units="units"
        />
      </Container>
      <LoadingButton
        v-if="observables.length === 0"
        @click="editing = true"
      >
        <h2>
          {{ intl.formatMessage({ id: 'dashboard.group.add.values' }) }}
        </h2>
      </LoadingButton>
    </Container>
    <GroupEditDialog 
      v-if="editing"
      :group="group"
      @close="handleEditClose"
    />
  </div>
</template>

<style scoped>
  .dashboard-group {
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