<script>
import { CloudApi } from '../../api/CloudApi'
import { EVENT, EventBus, GATEWAY_EVENT, toast } from '../../utils/EventBus'
import GatewayItem from './GatewayItem.vue'
import GatewayEditDialog from './GatewayEditDialog.vue'
import UpdateButton from '../base/controls/UpdateButton.vue'
import { useIntl } from 'vue-intl'
import BaseContainer from '../base/BaseContainer.vue'
import LoadingButton from '../base/controls/LoadingButton.vue'

export default {
  name: 'GatewaySelector',
  components: {
    GatewayItem,
    GatewayEditDialog,
    UpdateButton,
    BaseContainer,
    LoadingButton
  },
  emits: ['close'],
  data() {
    const intl = useIntl()

    return {
      intl,
      gateways: [],
      loading: false,
      showCreateDialog: false
    }
  },
  async mounted() {
    await this.loadGateways()
    EventBus.on(EVENT, this.handleGatewayEvent)
  },
  unmounted() {
    EventBus.off(EVENT, this.handleGatewayEvent)
  },
  methods: {
    handleGatewayClick(gateway) {
      if (gateway.online) {
        this.$router.push(`/${gateway.id}/panel`)
      } else {
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.select.offline' }),
          description: this.intl.formatMessage({ id: 'gateway.select.offline.desc' })
        })
      }
      this.$emit('close')
    },
    async loadGateways() {
      this.loading = true
      try {
        this.gateways = (await CloudApi.getGatewaysList()) || []
      } catch (error) {
        console.error(error)
        toast.error({
          caption: 'Failed to load gateways'
        })
      } finally {
        this.loading = false
      }
    },
    async createGateway(gateway) {
      try {
        await CloudApi.createGateway(gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'gateway.create.success' })
        })
        this.loadGateways()
        this.showCreateDialog = false
      } catch (error) {
        console.error(error)
        if (error?.response?.status == 400) {
          toast.error({
            caption: error.response.data
          })
        } else {
          toast.error({
            caption: this.intl.formatMessage({ id: 'gateway.create.error' })
          })
        }
      }
    },
    handleGatewayEvent({ gateway, event }) {
      if (!gateway || !Object.values(GATEWAY_EVENT).includes(event)) {
        return
      }
      this.gateways.forEach(({ id }, index) => {
        if (gateway.id === id) {
          this.gateways[index].online = event === GATEWAY_EVENT.CONNECTED
          return
        }
      })
    }
  }
}
</script>

<template>
  <div class="gateway-selector">
    <div class="header">
      <h2 class="header">
        {{ intl.formatMessage({ id: 'gateway.selector.title' }) }}
      </h2>
      <UpdateButton class="update" :loading="loading" :onClick="loadGateways" />
    </div>
    <BaseContainer :vertical="true">
      <GatewayItem
        v-for="gateway of gateways"
        :key="gateway.id"
        :gateway="gateway"
        @click="() => handleGatewayClick(gateway)"
        @gatewaysUpdate="loadGateways"
      />
      <LoadingButton @click="showCreateDialog = true">
        <h2>{{ intl.formatMessage({ id: 'gateway.create.button' }) }}</h2>
      </LoadingButton>
    </BaseContainer>
    <GatewayEditDialog
      :open="showCreateDialog"
      @save="createGateway"
      @close="showCreateDialog = false"
    />
  </div>
</template>

<style scoped>
.gateway-selector {
  margin: auto;
  padding: var(--default-padding);
  max-width: 400px;
}
.header {
  position: relative;
}
.update {
  position: absolute;
  top: 0px;
  right: 0px;
}
.clear-background::backdrop {
  background-color: unset;
}
</style>
