<script>  
    import SearchDeviceInfo from './SearchDeviceInfo.vue'
    import DeviceControlPanel from './DeviceControlPanel.vue'
    import TabItem from '../../tabs/TabItem.vue'
    import { Client } from '@stomp/stompjs';
    import { h } from 'vue'
    import RequestButton from '../../controls/RequestButton.vue';
    import { EventBus, REQUEST } from '../../../EventBus';

    const gatewayPath = import.meta.env.VITE_GATEWAY_PATH
    const gatewayPort = import.meta.env.VITE_GATEWAY_PORT
    const gatwayWs = import.meta.env.VITE_GATEWAY_WS

    const SEARCH_TOPIC = import.meta.env.VITE_GATEWAY_SEARCH_TOPIC
    const BROKER_URL = `ws://${gatewayPath}:${gatewayPort}/${gatwayWs}`
    const SEARCH_TIME = 10000

    export default {
        components: {
            SearchDeviceInfo,
            DeviceControlPanel,
            RequestButton,
            TabItem
        },
        data() {
            return {
                tabs: {},
                devices: {},
                selectedIp: null,
                client: null
            }
        },
        created() {
            this.connectToBroker()
        },
        methods: {
            async connectToBroker() {
                this.client = new Client({brokerURL: BROKER_URL});
                this.client.onConnect = () => {
                    EventBus.emit(REQUEST, {id: "search", loading: true})
                    this.devices = {}
                    this.selectedIp = null
                    console.log("Subscribing to search topic " + SEARCH_TOPIC)
                    this.client.subscribe(SEARCH_TOPIC, (message) => {
                        if (message && message.body) {
                            const deviceInfo = JSON.parse(message.body)
                            if (!this.devices[deviceInfo.ip]) {
                                this.devices[deviceInfo.ip] = deviceInfo
                            }
                        } else {
                            console.warn("Empty topic message")
                        }
                    }, {id: "search"})
                }
                console.log("Connecting to ws broker " + BROKER_URL)
                this.client.activate()
                setTimeout(this.disconnectFromBroker, SEARCH_TIME)
            },
            async disconnectFromBroker() {
                if (this.client) {
                    this.client.unsubscribe("search")
                    EventBus.emit(REQUEST, {id: "search", loading: false})
                    console.log("Unsubscribed from search topic")
                } else {
                    console.error("Can't disconnect from broker - client is null")
                }
            },
            switchTab(ip) {
                if (!this.tabs[ip]) {
                    this.tabs[ip] = h(
                        DeviceControlPanel,
                        {key: ip, ip}
                    );
                }
                this.selectedIp = ip;
            },
        },
    }
</script>

<template>
  <div class="devices-table">
    <div class="side-search">
        <h1 class="title">Found devices</h1>
        <div v-for="[ip, deviceInfo] in Object.entries(devices)" v-bind:key="ip">
            <Transition name="slide-left">
                <TabItem v-if="deviceInfo && deviceInfo.name" v-bind:selected="selectedIp == ip">
                    <SearchDeviceInfo
                        v-bind:ip="ip" 
                        v-bind:deviceInfo="deviceInfo"
                        v-on:click="switchTab(ip)"
                    />
                </TabItem>
            </Transition>
        </div>
        <RequestButton requestId="search" v-on:click="connectToBroker">
            <h1>Refresh</h1>
        </RequestButton>
    </div>
    <div class="main-tab" v-if="selectedIp">
        <KeepAlive>
            <component v-bind:is="tabs[selectedIp]"></component>
        </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
    .devices-table {
        display: flex;
        flex-direction: row;
        width: 1500px;
    }
    .side-search{
        display: grid;
        row-gap: var(--list-item-gap);
        width: 400px;
        margin-right: 5px;
        height: fit-content;
    }
    .main-tab {
        width: calc(100% - 400px);
        height: 70%;
    }
    
</style>
