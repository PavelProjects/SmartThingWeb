<script>
import { CloudApi } from '../../api/CloudApi';
import { toast } from '../../utils/EventBus';
import LoadingButton from '../controls/LoadingButton.vue';
import GatewayItem from './GatewayItem.vue';
import GatewayInfoDialog from './GatewayInfoDialog.vue';
import UpdateButton from '../controls/UpdateButton.vue';
import AddButton from '../controls/AddButton.vue'
import MenuView from '../menu/MenuView.vue';

export default {
    name: 'GatewaysList',
    components: {
        GatewayItem,
        MenuView,
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
                toast.info({
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
                toast.success({
                    caption: "Gateway saved"
                })
                this.showDialog = false
                this.loadGateways()
            } else {
                toast.error({
                    caption: "Failed to save gateway"
                })
            }
        },
        async deleteGateway(gateway) {
            if (confirm("Are you sure ypu want to delete gateway " + gateway.name + "?")) {
                const res = await CloudApi.deleteGateway(gateway);
                if (res) {
                    toast.success({
                        caption: "Gateway was deleted"
                    })
                    this.loadGateways()
                } else {
                    toast.error({
                        caption: "Failed to delete gateway"
                    })
                }
            }
        },
        async generateToken(gateway) {
            const { token } = await CloudApi.authGateway(gateway) || {}
            if (token) {
                toast.info({
                    caption: "Token generated",
                    description: token,
                    autoClose: false
                })
                this.loadGateways()
            } else {
                toast.error({
                    caption: "Failed to generate gateway token",
                })
            }
        },
        async logoutGateway(gateway) {
            if(!confirm("Are you sure? THis action will delete token and disconnect gateway from cloud!")) {
                return;
            }
            if (await CloudApi.logoutGateway(gateway)) {
                toast.info({
                    caption: "Token deleted"
                })
                this.loadGateways()
            } else {
                toast.error({
                    caption: "Failed to logout gateway",
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
            <GatewayItem
                v-for="gateway in gateways"
                :key="gateway.id"
                :gateway="gateway"
                @updateGateway="handleUpdategateway(gateway)"
                @deleteGateway="deleteGateway(gateway)"
                @generateToken="generateToken(gateway)"
                @showControlPanel="showControlPanel(gateway)"
                @logout="logoutGateway(gateway)"
                :class="{'menu-selected': selectedGateway && selectedGateway.id == gateway.id}"
            />
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