<script>
import DashboardValue from './DashboardValue.vue'
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
    DashboardValue,
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
      values: {},
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
          this.values = JSON.parse(message.body)
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
    updateButtonTitle() {
      let count = -1
      try {
        const date = new Date(this.values.lastUpdate)
        count = Math.round((this.currentTime - date) / 1000)
      } catch (error) {
        console.error(error)
      }
      return this.intl.formatMessage(
        { id: 'dashboard.group.update.title' },
        { updateDelay: this.updateDelay / 1000, count }
      )
    },
    deviceTitle() {
      return this.intl.formatMessage({ id: 'dashboard.group.device.title' }, this.device)
    }
  },
  methods: {
    async loadValues() {
      this.loading = true
      try {
        this.values = await DashboardApi.getGroupValues(this.id, this.gateway)
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
        this.values = await DashboardApi.updateGroupValues(this.id, this.gateway)
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'dashboard.group.values.load.error' })
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
      <UpdateButton
        v-if="observables.length > 0"
        class="update"
        :title="updateButtonTitle"
        :loading="loading"
        :onClick="updateValues"
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
      <Container class="values">
        <DashboardValue
          v-if="observables.length > 0"
          v-for="{ name, type, units }, index of observables"
          :key="index"
          :type="type"
          :name="name"
          :value="values?.[type + 's']?.[name] ?? 'Nan'"
          :units="units"
        />
        <LoadingButton
          v-else
          class="add-values"
          @click="editing = true"
        >
          <h2>
            {{ intl.formatMessage({ id: 'dashboard.group.add.values' }) }}
          </h2>
        </LoadingButton>
      </Container>
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
  .values .dashboard-value {
    padding: var(--default-gap);
    border-right: 2px solid var(--color-border);
  }
  .values .dashboard-value:last-child {
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
