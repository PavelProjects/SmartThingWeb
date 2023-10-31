<script>  
    import SearchDeviceInfo from './SearchDeviceInfo.vue'
    import DeviceControlPanel from './DeviceControlPanel.vue'
    import TabItem from '../../tabs/TabItem.vue'
    import { Client } from '@stomp/stompjs';
    import { h } from 'vue'
    import RequestButton from '../../controls/RequestButton.vue';
    import { EventBus, REQUEST } from '../../../utils/EventBus';
    import { GatewayApi } from '../../../api/GatewayApi'

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
        mounted() {
            this.search();
        },
        methods: {
            search() {
                GatewayApi.searchDevices((deviceInfo) => {
                    if (!this.devices[deviceInfo.ip]) {
                        this.devices[deviceInfo.ip] = deviceInfo
                    }
                });
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
        <div class="search-results">
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
            <RequestButton requestId="search" v-on:click="search">
                <h1>Refresh</h1>
            </RequestButton>
        </div>
    </div>
    <div class="main-tab" v-if="selectedIp">
        <h1 class="title">Control panel</h1>
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
        width: 400px;
        margin-right: 5px;
    }
    .search-results {
        display: grid;
        row-gap: var(--list-item-gap);
        height: fit-content;
    }
    .main-tab {
        width: calc(100% - 400px);
        height: 70%;
    }
    
</style>
