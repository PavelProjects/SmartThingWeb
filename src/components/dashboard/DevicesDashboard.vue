<script>
import DashboardGroup from './DashboardGroup.vue'
import PlusSVG from 'vue-material-design-icons/Plus.vue'
import GroupAddDialog from './GroupAddDialog.vue'
import { DashboardApi } from '../../api/gateway/DashboardApi'
import { useIntl } from 'vue-intl'
import RiseLoader from 'vue-spinner/src/RiseLoader.vue'
import { toast } from '../../utils/EventBus'
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'DevicesDashboard',
  components: {
    DashboardGroup,
    GroupAddDialog,
    BaseContainer,
    PlusSVG,
    RiseLoader
  },
  inject: ['gateway'],
  data() {
    const intl = useIntl()
    return {
      intl,
      groups: [],
      loading: false,
      addGroupDialog: false,
      currentTime: new Date(),
      timeUpdateInterval: -1
    }
  },
  mounted() {
    this.timeUpdateInterval = setInterval(() => (this.currentTime = new Date()), 1000)
    this.loadGroups()
  },
  unmounted() {
    clearInterval(this.timeUpdateInterval)
  },
  methods: {
    async loadGroups() {
      this.loading = true
      this.groups = []
      try {
        this.groups = await DashboardApi.getGroups(this.gateway)
      } catch (error) {
        console.error(error)
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
    <BaseContainer class="groups" :vertical="true">
      <RiseLoader v-if="loading" class="spinner" />
      <DashboardGroup
        v-for="group of groups"
        :key="group.id"
        :gateway="gateway"
        :group="group"
        :currentTime="currentTime"
        @updateGroups="loadGroups"
        style="margin: auto"
      />
      <BaseContainer v-if="!loading" :vertical="true">
        <div v-if="!groups?.length">
          <h2 class="title">
            {{ intl.formatMessage({ id: 'dashboard.groups.empty' }) }}
          </h2>
        </div>
        <PlusSVG
          class="add"
          :title="intl.formatMessage({ id: 'dashboard.group.add.new' })"
          :size="40"
          @click.stop="addGroupDialog = true"
        />
      </BaseContainer>
    </BaseContainer>
    <GroupAddDialog v-if="addGroupDialog" :groups="groups" @close="handleAddClose" />
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  padding: 10px;
}
.groups {
  margin: auto;
  flex-wrap: wrap;
}
.spinner {
  padding-top: 30px;
}
.add {
  margin: auto;
  cursor: pointer;
}
</style>
