<script>
import DashboardValuesView from './DashboardValuesView.vue'
import ContextMenu from '../menu/ContextMenu.vue'
import GroupEditDialog from './GroupEditDialog.vue'
import { useIntl } from 'vue-intl'
import LoadingButton from '../controls/LoadingButton.vue'
import { DashboardApi } from '../../api/gateway/DashboardApi'
import { toast } from '../../utils/EventBus'
import UpdateButton from '../controls/UpdateButton.vue'
import Container from '../base/Container.vue'
import { useStompClientStore } from '../../store/stompClientStore'

export default {
  components: {
    DashboardValuesView,
    ContextMenu,
    GroupEditDialog,
    LoadingButton,
    UpdateButton,
    Container
  },
  name: 'DashboardGroup',
  emits: ['updateGroups'],
  props: {
    gateway: Object,
    group: Object,
    currentTime: Object
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      updateDelay: this.group?.config?.updateDelay || 60000,
      loading: false,
      observablesValues: {},
      editing: false,
      features: {},
      ...this.group
    }
  },
  async mounted() {
    const client = useStompClientStore()
    try {
      const topic = '/dashboard/' + this.id
      client.subscribe(
        topic,
        (message) => {
          if (!message?.body) {
            console.error('Empty message body!')
            return
          }
          const updates = JSON.parse(message.body)
          if (Array.isArray(updates)) {
            updates.forEach(({ observable, value }) => {
              const key = `${observable.type}_${observable.name}`
              if (!!this.observablesValues[key]) {
                this.observablesValues[key].values = [
                  value,
                  ...this.observablesValues[key].values ?? []
                ]
              }
            })
          } else {
            console.error("Incoming values updates is not an array")
          }
        },
        topic
      )
    } catch (error) {
      console.error(error)
    }
    this.loadValues()
  },
  unmounted() {
    const client = useStompClientStore()
    try {
      client.unsubscribe('/dashboard/' + this.id)
    } catch (error) {
      console.error(error)
    }
  },
  computed: {
    deviceTitle() {
      return this.intl.formatMessage({ id: 'dashboard.group.device.title' }, this.device)
    }
  },
  methods: {
    async loadValues() {
      this.loading = true
      try {
        const values = await DashboardApi.getGroupValues(this.id, this.gateway)
        this.observablesValues = values.reduce((acc, { observable, values }) => {
          acc[`${observable.type}_${observable.name}`] = { observable, values }
          return acc
        }, {})
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'dashboard.group.values.load.error' })
        })
      } finally {
        this.loading = false
      }
    },
    async updateValues() {
      this.loading = true
      try {
        await DashboardApi.updateValues(this.id, this.gateway)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'dashboard.group.values.update.error' })
        })
      } finally {
        this.loading = false
      }
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
          console.error(error)
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
    <Container class="dashboard-group bordered" :vertical="true" gap="0">
      <!-- todo rework or remove -->
      <UpdateButton
        v-if="observables.length > 0"
        class="update"
        title="Force update all values"
        :loading="loading"
        :onClick="() => updateValues()"
      />
      <h2 class="title" :title="deviceTitle">
        {{ group.device.name }}
      </h2>
      <ContextMenu class="context-menu">
        <p @click="editing = true">
          {{ intl.formatMessage({ id: 'dashboard.group.edit' }) }}
        </p>
        <p @click="deleteGroup">
          {{ intl.formatMessage({ id: 'dashboard.group.delete' }) }}
        </p>
      </ContextMenu>
      <Container class="values" v-if="observables.length > 0">
        <DashboardValuesView
          v-for="({ observable, values }, index) of observablesValues"
          :key="index"
          :observable="observable"
          :values="values"
        />
      </Container>
      <LoadingButton v-else class="add-values" @click="editing = true">
        <h2>
          {{ intl.formatMessage({ id: 'dashboard.group.add.values' }) }}
        </h2>
      </LoadingButton>
    </Container>
    <GroupEditDialog v-if="editing" :group="group" @close="handleEditClose" />
  </div>
</template>

<style scoped>
.dashboard-group {
  position: relative;
  width: fit-content;
}
.dashboard-group .title {
  border-bottom: 2px solid var(--color-border);
}
.update {
  position: absolute;
  top: 2px;
  left: 2px;
}
.add-values {
  margin: var(--default-gap);
}
.values .dashboard-values {
  padding: var(--default-gap);
  border-right: 2px solid var(--color-border);
}
.values .dashboard-values:last-child {
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
