<script>
import ModalDialog from '../base/ModalDialog.vue'
import { CLOUD_API_URL, CloudApi } from '../../api/CloudApi'
import { toast } from '../../utils/EventBus'
import GatewayEditDialog from './GatewayEditDialog.vue'
import InputField from '../base/fields/InputField.vue'
import { useIntl } from 'vue-intl'
import ContextMenu from '../menu/ContextMenu.vue'
import BaseContainer from '../base/BaseContainer.vue'

export default {
  name: 'GatewayItem',
  props: {
    gateway: Object
  },
  emits: ['gatewaysUpdate', 'click'],
  components: {
    ModalDialog,
    GatewayEditDialog,
    InputField,
    ContextMenu,
    BaseContainer
  },
  data() {
    const intl = useIntl()
    return {
      intl,
      token: undefined, // todo rename
      showEditDialog: false,
      tokenData: {
        cloudUrl: CLOUD_API_URL,
        token: undefined
      }
    }
  },
  watch: {
    tokenData: {
      handler: function () {
        this.buildToken()
      },
      deep: true
    }
  },
  methods: {
    async saveGateway(gateway) {
      try {
        await CloudApi.updateGateway(gateway)
        toast.success({
          caption: this.intl.formatMessage({ id: 'gateway.item.save.success' })
        })
        this.$emit('gatewaysUpdate')
        this.showEditDialog = false
      } catch (error) {
        console.error(error)
        if (error.response.status == 400) {
          toast.error({
            caption: error.response.data
          })
        } else {
          toast.error({
            caption: this.intl.formatMessage({ id: 'gateway.item.save.error' })
          })
        }
      }
    },
    async deleteGateway() {
      if (
        confirm(
          this.intl.formatMessage(
            { id: 'gateway.item.delete.confirm' },
            { name: this.gateway.name }
          )
        )
      ) {
        try {
          await CloudApi.deleteGateway(this.gateway)
          toast.success({
            caption: this.intl.formatMessage({ id: 'gateway.item.delete.success' })
          })
          this.$emit('gatewaysUpdate')
          this.$router.push('/')
        } catch (error) {
          console.error(error)
          toast.error({
            caption: this.intl.formatMessage({ id: 'gateway.item.delete.error' })
          })
        }
      }
    },
    async generateToken() {
      try {
        const { token } = (await CloudApi.authGateway(this.gateway)) || {}
        if (!token) {
          throw new Error('Empty token response')
        }
        toast.info({
          caption: this.intl.formatMessage({ id: 'gateway.item.token.gen.success' })
        })
        this.tokenData.token = token
        this.$emit('gatewaysUpdate')
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.item.token.gen.error' })
        })
      }
    },
    buildToken() {
      if (!this.tokenData) {
        return
      }
      const { cloudUrl, token } = this.tokenData
      if (!cloudUrl) {
        this.token = this.intl.formatMessage({ id: 'gateway.item.token.validation.url.blank' })
        return
      }
      this.token = btoa(`${cloudUrl}|${token}`)
    },
    async deleteToken() {
      if (!confirm(this.intl.formatMessage({ id: 'gateway.item.token.delete.confirm' }))) {
        return
      }
      try {
        await CloudApi.logoutGateway(this.gateway)
        toast.info({
          caption: this.intl.formatMessage({ id: 'gateway.item.token.delete.success' })
        })
        this.$emit('gatewaysUpdate')
      } catch (error) {
        console.error(error)
        toast.error({
          caption: this.intl.formatMessage({ id: 'gateway.item.token.delete.error' })
        })
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="gateway-item bordered" @click="$emit('click')">
      <div
        class="status"
        :style="{ background: gateway.online ? 'green' : 'red' }"
        :title="intl.formatMessage({ id: 'gateway.item.status' }, { status: gateway.online })"
      ></div>
      <div class="info">
        <h2>{{ gateway.name }}</h2>
        <h3>{{ gateway.description }}</h3>
      </div>
      <ContextMenu class="menu">
        <p @click="showEditDialog = true">
          {{ intl.formatMessage({ id: 'gateway.item.button.edit' }) }}
        </p>
        <p @click="deleteGateway">
          {{ intl.formatMessage({ id: 'gateway.item.button.delete' }) }}
        </p>
        <p v-if="gateway.haveToken" @click="deleteToken">
          {{ intl.formatMessage({ id: 'gateway.item.button.token.delete' }) }}
        </p>
        <p v-else @click="generateToken">
          {{ intl.formatMessage({ id: 'gateway.item.button.token.gen' }) }}
        </p>
      </ContextMenu>
    </div>
    <GatewayEditDialog
      v-if="showEditDialog"
      :gateway="gateway"
      @save="saveGateway"
      @close="showEditDialog = false"
    />
    <ModalDialog id="token-generator" v-if="token" @close="token = undefined">
      <BaseContainer :vertical="true">
        <h2 class="title">
          {{ intl.formatMessage({ id: 'gateway.item.connection.token' }) }}
        </h2>
        <BaseContainer :vertical="true">
          <InputField
            :label="intl.formatMessage({ id: 'gateway.item.cloud.url' })"
            v-model="tokenData.cloudUrl"
            :validationFailed="tokenData.cloudUrl.length === 0"
          />
          <InputField
            :label="intl.formatMessage({ id: 'gateway.item.auth.token' })"
            v-model="tokenData.token"
            :validationFailed="tokenData.token.length === 0"
          />
        </BaseContainer>
        <BaseContainer :vertical="true">
          <h3>{{ intl.formatMessage({ id: 'gateway.item.auth.connection.token' }) }}</h3>
          <p class="token-field">{{ token }}</p>
        </BaseContainer>
      </BaseContainer>
    </ModalDialog>
  </div>
</template>

<style scoped>
.info {
  padding: 0px 30px;
}
.gateway-item {
  background-color: var(--color-background);
  padding: var(--default-padding);
  text-align: center;
  position: relative;
}
.status {
  position: absolute;
  top: var(--default-padding);
  left: var(--default-padding);
  width: 20px;
  height: 20px;
  border-radius: 50%;
}
.menu {
  position: absolute;
  top: 0px;
  right: 0px;
}
.token-field {
  padding: var(--default-padding);
  width: 50vw;
  word-wrap: break-word;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius);
}
</style>
