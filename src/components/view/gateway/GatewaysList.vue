<script>
import { CloudApi } from '../../../api/CloudApi';
import { notify } from '../../../utils/EventBus';
import LoadingButton from '../../controls/LoadingButton.vue';
import TabItem from '../../tabs/TabItem.vue';
import TabsView from '../../tabs/TabsView.vue';
import GatewayItem from './GatewayItem.vue';
import { ERROR_TYPE, SUCCESS_TYPE } from '../../notifications/Toast.vue';
import GatewayInfoDialog from './GatewayInfoDialog.vue';
import UpdateButton from '../../controls/UpdateButton.vue';
import AddButton from '../../controls/AddButton.vue'

export default {
    name: 'GatewaysList',
    components: {
        GatewayItem,
        TabsView,
        TabItem,
        LoadingButton,
        GatewayInfoDialog,
        UpdateButton,
        AddButton,
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
                await this.checkGatewaysOnline()
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
        async checkGatewaysOnline() {
            if (!this.gateways) {
                return;
            }
            this.gateways.forEach(async (gateway) => {
                gateway.online = await CloudApi.isOnline(gateway) || false
            })
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
        async logoutGateway(gateway) {
            if (await CloudApi.logoutGateway(gateway)) {
                notify({
                    caption: "Done"
                })
                this.loadGateways()
            } else {
                notify({
                    caption: "Failed to logout gateway",
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
            <UpdateButton
                class="update"
                title="Update gateways"
                :loading="loading"
                :onClick="loadGateways"
            />
            <AddButton 
                class="add-icon" 
                title="Add new gateway"
                :onClick="handleCreateGateway"
            />
        </div>
        <div class="list">
            <TabItem
                v-for="gateway in gateways"
                :key="gateway.id"
                :selected="selectedGateway && selectedGateway.id == gateway.id"
            >
                <GatewayItem 
                    :gateway="gateway"
                    @updateGateway="handleUpdategateway(gateway)"
                    @deleteGateway="deleteGateway(gateway)"
                    @generateToken="generateToken(gateway)"
                    @showControlPanel="showControlPanel(gateway)"
                    @logout="logoutGateway(gateway)"
                />
            </TabItem>
        </div>
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
        left: 0px;
    }
    .update {
        position: absolute;
        right: 0px;
        top: 5px;
    }
</style>