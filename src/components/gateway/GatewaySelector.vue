<script>
import { CloudApi } from '../../api/CloudApi'
import { EVENT, EventBus, GATEWAY_EVENT, toast } from '../../utils/EventBus'
import GatewayItem from './GatewayItem.vue'
import GatewayEditDialog from './GatewayEditDialog.vue'
import UpdateButton from '../base/controls/UpdateButton.vue'
import { useIntl } from 'vue-intl'
import ModalDialog from '../base/ModalDialog.vue'
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'GatewaySelector',
  components: {
    GatewayItem,
    GatewayEditDialog,
    UpdateButton,
    ModalDialog,
    BaseContainer
  },
  emits: ['close'],
  data() {
    const intl = useIntl()

    return {
      intl,
      gateways: [],
      loading: false,
      showCreateDialog: false,
      modalClass: this.$route.params.gateway ? '' : 'clear-background'
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
  <ModalDialog id="gateway-selector" :class="modalClass" @close="$emit('close')">
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
          @click="handleGatewayClick(gateway)"
          @gatewaysUpdate="loadGateways"
        />
        <button class="btn" @click="showCreateDialog = true">
          <h2>{{ intl.formatMessage({ id: 'gateway.create.button' }) }}</h2>
        </button>
      </BaseContainer>
      <GatewayEditDialog
        v-if="showCreateDialog"
        :gateway="{}"
        @save="createGateway"
        @close="showCreateDialog = false"
      />
    </div>
  </ModalDialog>
</template>

<style scoped>
.gateway-selector {
  margin: auto;
  padding: var(--default-padding);
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
