<script>  
  import DeviceInfoBlock from './DeviceInfoBlock.vue'
  import DeviceControlPanel from './DeviceControlPanel.vue'

  import SyncLoader from 'vue-spinner/src/SyncLoader.vue'
  import { Client } from '@stomp/stompjs';
  import { h } from 'vue'
  
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
            tabs: {},
            devices: {},
            selectedIp: null,
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
                this.selectedIp = null
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
        switchTab(ip, deviceInfo) {
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
  <div class="panel">
    <div class="side-search">
        <button class="clicable" v-if="!loading" v-on:click="connectToBroker">
            <h1>Refresh</h1>
        </button>
        <sync-loader :loading="loading"></sync-loader>
        <div v-for="[ip, deviceInfo] in Object.entries(devices)" v-bind:key="ip">
            <Transition name="slide-left">
                <DeviceInfoBlock
                    v-bind:ip="ip" 
                    v-bind:deviceInfo="deviceInfo"
                    v-bind:selected="selectedIp == ip"
                    v-on:click="switchTab(ip)"
                    class="clicable"
                />
            </Transition>
        </div>
    </div>
    <div class="main-tab" v-if="selectedIp">
        <Transition name="slide-rigth">
            <KeepAlive>
                <component v-bind:is="tabs[selectedIp]"></component>
            </KeepAlive>
        </Transition>
    </div>
  </div>
</template>

<style scoped>
    .slide-rigth-enter-active {
        transition: all 0.5s ease;
    }
    .slide-rigth-enter-from{
      opacity: 0;
    }
    .slide-left-enter-active {
        transition: all 0.5s ease;
      }
      .slide-left-enter-from{
        transform: translateX(-200px);
        opacity: 0;
      }
    .panel {
        display: grid;
        grid-template-columns: auto;
        grid-template-columns: 1fr 4fr;
        column-gap: 10px;
    }
    .side-search{
        display: grid;
        row-gap: 5px;
        padding: 5px;
        height: 100%;
        width: 400px;
    }
    .clicable {
        cursor: pointer;
    }
    
</style>
