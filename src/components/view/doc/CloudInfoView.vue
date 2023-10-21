<script>
    import { GatewayApi } from '../../../api/GatewayApi.js';
    import InputWithLabel from '../../fields/InputWithLabel.vue';

    export default {
        name: "CloudInfoView",
        components: {
            InputWithLabel
        },
        data() {
            return {
                cloudPopupVisible: false,
                statusIntervalId: null,
                status: {},
                cloudInfo: {}
            }
        },
        computed: {
            cloudConnected() {
                const { gatewayInfoLoaded, connectedToBroker, subscribedToQueue } = this.status || {}
                return  gatewayInfoLoaded && connectedToBroker && subscribedToQueue
            },
            gatewayInfoLoaded() {
                return this.status.gatewayInfoLoaded || false
            },
            connectedToBroker() {
                return this.status.connectedToBroker || false
            },
            subscribedToQueue() {
                return this.status.subscribedToQueue || false
            }
        },
        created() {
            this.loadCloudInfo()
            this.loadStatus()
            
            this.statusIntervalId = setInterval(
                this.loadStatus,
                10000
            )
        },
        methods: {
            async loadCloudInfo() {
                this.cloudInfo = await GatewayApi.getCloudInfo()
            },
            async loadStatus() {
                this.status = await GatewayApi.getStatus()
            },
            async saveCloudInfo() {
                await GatewayApi.updateCloudInfo(this.cloudInfo)
            },
            openCloudInfoEditor() {
                this.cloudPopupVisible = !this.cloudPopupVisible
            }
        }
    }
</script>

<template>
    <div>
        <h2 class="status" 
            :class="{green: cloudConnected, red: !cloudConnected}"
            @click="openCloudInfoEditor"
        >
            {{ cloudConnected ? 'Connected' : 'Not connected' }} to the cloud
        </h2>
        <div v-if="cloudPopupVisible" class="overlay" @click="cloudPopupVisible = false"></div>
        <div v-if="cloudPopupVisible" class="cloud-popup">
            <h2 class="title">Status</h2>
            <h3 :class="{green: gatewayInfoLoaded, red: !gatewayInfoLoaded}">
                Gateway info {{ gatewayInfoLoaded ? 'loaded' : 'not loaded' }} 
            </h3>
            <h3 :class="{green: connectedToBroker, red: !connectedToBroker}">
                {{ connectedToBroker ? 'Connected' : 'Not connected' }} to the message broker
            </h3>
            <h3 :class="{green: subscribedToQueue, red: !subscribedToQueue}">
               {{ subscribedToQueue ? 'Subscribed' : 'Not subscribed' }} to the message queue
            </h3>

            <h2 class="title">Cloud configuration</h2>
            <InputWithLabel
                label="Token"
                :value="cloudInfo.token || 'Failed to load'"
                @input="cloudInfo.token = $event.target.value"
            />
            <InputWithLabel
                label="Cloud url"
                :value="cloudInfo.cloudUrl || 'Failed to load'"
                @input="cloudInfo.cloudUrl = $event.target.value"
            />
            <InputWithLabel
                label="Broker ip"
                :value="cloudInfo.brokerIp || 'Failed to load'"
                @input="cloudInfo.brokerIp = $event.target.value"
            />
            <button
                @click="saveCloudInfo"
            >
                <h2>save</h2>
            </button>
        </div>
    </div>
</template>

<style scoped>
    .status {
        cursor: pointer;
        user-select: none;
    }
    .overlay {
        position: absolute;
        left: 0px;
        width: 100vw;
        height: calc(100vh - var(--doc-height));
    }
    .cloud-popup {
        position: absolute;
        top: calc(var(--doc-height) + var(--list-item-gap));
        right: var(--list-item-gap);
        width: 400px;
        display: flex;
        flex-direction: column;
        row-gap: var(--list-item-gap);
        text-align: center;
        background-color: var(--color-background-soft);
        border-radius: var(--border-radius);
        padding: 5px;
    }
</style>