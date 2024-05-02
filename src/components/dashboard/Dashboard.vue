<script>
import DashboardGroup from './DashboardGroup.vue';
import { useDashboardStore } from '../../store/dashboardStore'
import { storeToRefs } from 'pinia';
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import GroupAddDialog from './GroupAddDialog.vue';
import { DashboardApi } from '../../api/gateway/DashboardApi';
import { useIntl } from 'vue-intl';
import { useGatewayStore } from '../../store/gatewayStore';
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import { toast } from '../../utils/EventBus';

export default {
  name: 'Dashboard',
  components: {
    DashboardGroup,
    GroupAddDialog,
    PlusSVG,
    RiseLoader
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
      loading: false,
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
      this.loading = true
      this.groups = []
      try {
        this.groups = await DashboardApi.getGroups(this.gateway)
      } catch (error) {
        console.log(error)
        toast.error({ 
          caption: this.intl.formatMessage({ id: 'dashboard.load.error' })
        })
      } finally {
        this.loading = false
      }
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
      <RiseLoader v-if="loading" class="spinner" />
      <DashboardGroup
        v-for="group of groups"
        :key="group.id"
        :group="group"
        @updateGroups="loadGroups"
      />
      <div v-if="!loading" class="list">
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
  .spinner {
    padding-top: 30px;
  }
  .add {
    margin: auto;
    cursor: pointer;
  }
</style>