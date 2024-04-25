<script>
import DashboardGroup from './DashboardGroup.vue';
import { useDashboardStore } from '../../store/dashboardStore'
import { storeToRefs } from 'pinia';
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import GroupAddDialog from './GroupAddDialog.vue';
import { DashboardApi } from '../../api/gateway/DashboardApi';
import { useIntl } from 'vue-intl';
import { useGatewayStore } from '../../store/gatewayStore';

export default {
  name: 'Dashboard',
  components: {
    DashboardGroup,
    PlusSVG,
    GroupAddDialog
  },
  data() {
    const intl = useIntl()
    const { gateway } = storeToRefs(useGatewayStore())
    const store = useDashboardStore()
    const { groups } = storeToRefs(store)
    return {
      intl,
      groups,
      store,
      gateway,
      addGroupDialog: false
    }
  },
  watch: {
    gateway() {
      this.loadGroups()
    }
  },
  methods: {
    async loadGroups() {
      this.groups = []
      this.groups = await DashboardApi.getGroups(this.gateway)
    },
    handleAddClose(result) {
      if (result) {
        this.loadGroups()
      }
      this.addGroupDialog = false
    }
  }
}
</script>

<template>
  <div class="dashboard">
    <div class="groups">
      <DashboardGroup 
        v-for="group of groups"
        :key="group.id"
        :group="group"
        @updateGroups="loadGroups"
      />
      <div class="list">
        <div v-if="!groups?.length">
          <h1 class="title">
            {{ intl.formatMessage({ id: 'dashboard.groups.empty' }) }}
          </h1>
        </div>
        <PlusSVG
          class="add"
          :title="intl.formatMessage({ id: 'dashboard.group.add.new' })"
          :size="40"
          @click.stop="addGroupDialog = true"
        />
      </div>
    </div>
    <GroupAddDialog 
      v-if="addGroupDialog"
      @close="handleAddClose"
    />
  </div>
</template>

<style scoped>
  .dashboard {
    display: flex;
    padding: 10px;
  }
  .groups {
    margin: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: var(--default-gap);
  }
  .add {
    margin: auto;
    cursor: pointer;
  }
</style>