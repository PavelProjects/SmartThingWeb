<script>
import { CloudApi } from '../../../api/CloudApi';
import { notify } from '../../../utils/EventBus';
import LoadingButton from '../../controls/LoadingButton.vue';
import TabItem from '../../tabs/TabItem.vue';
import TabsView from '../../tabs/TabsView.vue';
import GatewayItem from './GatewayItem.vue';
import { ERROR_TYPE, SUCCESS_TYPE } from '../../notifications/Notifification.vue';
import GatewayInfoDialog from './GatewayInfoDialog.vue';

export default {
    name: 'GatewaysList',
    components: {
        GatewayItem,
        TabsView,
        TabItem,
        LoadingButton,
        GatewayInfoDialog,
    },
    data() {
        return {
            gateways: [],
            selectedGateway: {},
            gatewayToEdit: {},
            showDialog: false,
            loading: false,
        }
    },
    mounted() {
        this.loadGateways()
    },
    methods: {
        async loadGateways() {
            this.loading = true
            try {
                this.gateways = await CloudApi.getGatewaysList() || []
            } finally {
                this.loading = false
            }

            if (this.selectedGateway) {
                const gateway = this.gateways.find((gateway) => gateway.id == this.selectedGateway.id)
                if (!gateway || !gateway.online) {
                    this.selectedGateway = null
                }
            }
        },
        showControlPanel(gateway) {
            if (gateway.online) {
                this.selectedGateway = gateway
                this.$emit('select', gateway)
            } else {
                notify({
                    caption: "Gateway is offline",
                    description: "Can't open offline gateway control panel"
                })
            }
        },
        async saveGateway(gateway, newValues) {
            let result = false;

            if (gateway.id) {
                result = await CloudApi.updateGateway({...gateway, ...newValues})
            } else {
                result = await CloudApi.createGateway(newValues)
            }
            
            if (result) {
                notify({
                    type: SUCCESS_TYPE,
                    caption: "Gateway saved"
                })
                this.showDialog = false
                this.loadGateways()
            } else {
                notify({
                    type: ERROR_TYPE,
                    caption: "Failed to save gateway"
                })
            }
        },
        async deleteGateway(gateway) {
            if (confirm("Are you sure ypu want to delete gateway " + gateway.name + "?")) {
                const res = await CloudApi.deleteGateway(gateway);
                if (res) {
                    notify({
                        type: SUCCESS_TYPE,
                        caption: "Gateway was deleted"
                    })
                    this.loadGateways()
                } else {
                    notify({
                        type: ERROR_TYPE,
                        caption: "Failed to delete gateway"
                    })
                }
            }
        },
        async generateToken(gateway) {
            const { token } = await CloudApi.authGateway(gateway) || {}
            if (token) {
                notify({
                    caption: "Token generated",
                    description: token,
                    autoClose: false
                })
                this.loadGateways()
            } else {
                notify({
                    caption: "Failed to generate gateway token",
                    type: ERROR_TYPE
                })
            }
        },
        handleCreateGateway() {
            this.gatewayToEdit = {}
            this.showDialog = true
        },
        handleUpdategateway(gateway) {
            this.gatewayToEdit = gateway
            this.showDialog = true
        }
    }
}
</script>

<template>
    <div style="width: 300px;">
        <div class="header">
            <h1 class="title">Gateways</h1>
            <button 
                class="add-icon" 
                title="Add new gateway"
                @click="handleCreateGateway"
            >
                Add
            </button>
        </div>
        <div class="list">
            <TabItem
                v-for="gateway in gateways"
                :key="gateway.id"
                :selected="selectedGateway.id == gateway.id"
            >
                <GatewayItem 
                    :gateway="gateway"
                    :updateGateway="handleUpdategateway"
                    :deleteGateway="deleteGateway"
                    :generateToken="generateToken"
                    :showControlPanel="showControlPanel"
                    @reload="loadGateways()"
                />
            </TabItem>
        </div>
        <LoadingButton
            style="width: 100%; margin-top: 5px;"
            :loading="loading"
            @click="loadGateways"
        >
            <h1>Refresh</h1>
        </LoadingButton>
        <GatewayInfoDialog
            :visible="showDialog"
            :gateway="gatewayToEdit"
            :save="saveGateway"
            @close="() => showDialog = false"
        />
    </div>
</template>

<style scoped>
    .header {
        position: relative;
    }
    .add-icon {
        position: absolute;
        top: 0px;
        right: 0px;
    }
</style>