<script>
  import DeviceInfoBlock from './DeviceInfoBlock.vue'
  import DeviceControlPanel from './DeviceControlPanel.vue'

  import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
  import { Client } from '@stomp/stompjs';
  
  const BROKER_URL = "ws://192.168.1.82:8080/smartthing-ws"
  const SEARCH_TOPIC = "/devices/search"

  export default {
    components: {
        DeviceInfoBlock,
        DeviceControlPanel,
        SyncLoader
    },
    data() {
        return {
            devices: {},
            selectedDevice: null,
            client: null,
            loading: true
        }
    },
    created() {
        this.connectToBroker()
    },
    methods: {
        async connectToBroker() {
            this.client = new Client({brokerURL: BROKER_URL});
            this.client.onConnect = () => {
                this.loading = true
                this.devices = {}
                this.selectedDevice = null
                this.client.subscribe(SEARCH_TOPIC, (message) => {
                    if (message && message.body) {
                        const deviceInfo = JSON.parse(message.body)
                        if (!this.devices[deviceInfo.ip]) {
                            this.devices[deviceInfo.ip] = {}
                            this.loadDeviceInfo(deviceInfo.ip)
                        }
                    } else {
                        console.warn("Empty topic message")
                    }
                }, {id: "search"})
            }
            this.client.activate()
            setTimeout(this.disconnectFromBroker, 2000)
        },
        async disconnectFromBroker() {
            if (this.client) {
                this.client.unsubscribe("search")
                this.loading = false
                console.log("Unsubscribed from search topic")
            } else {
                console.error("Can't disconnect from broker - client is null")
            }
        },
        async loadDeviceInfo(deviceIp) {
            const url = "http://" + deviceIp + "/info/system"
            this.devices[deviceIp] = await (await fetch(url)).json()
        },
    },
  }
</script>

<template>
  <div class="panel">
    <div class="side-search">
        <button v-if="!loading" v-on:click="connectToBroker"><h1>Search</h1></button>
        <sync-loader :loading="loading"></sync-loader>
        <div v-for="[ip, deviceInfo] in Object.entries(devices)">
            <DeviceInfoBlock
                v-bind:deviceIp="ip" 
                v-bind:deviceInfo="deviceInfo"
                v-on:selected="selectedDevice = {info: deviceInfo, ip}"
            />
        </div>
    </div>
    <div class="main-tab">
        <DeviceControlPanel 
            v-if="selectedDevice"
            v-bind:deviceInfo="selectedDevice.info" 
            v-bind:deviceIp="selectedDevice.ip"
        />
    </div>
  </div>
</template>

<style>
    .panel {
        display: grid;
        grid-template-columns: auto;
        grid-template-areas: 'search main';
        column-gap: 10px;
    }
    .side-search{
        grid-area: search;
        display: grid;
        row-gap: 5px;
        border: solid;
        border-color: rgb(70, 70, 70);
        border-radius: 10px;
        padding: 5px;
        height: 100%;
    }
    .main-tab {
        grid-area: main;
    }
    
</style>
