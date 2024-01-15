<script>  
    import DeviceControlPanel from './DeviceControlPanel.vue'
    import MenuItem from '../menu/MenuItem.vue'
    import { h } from 'vue'
    import { SearchApi } from '../../api/SearchDevicesApi';
    import { EventBus, REQUEST } from '../../utils/EventBus';
    import UpdateButton from '../controls/UpdateButton.vue';

    export default {
        components: {
            DeviceControlPanel,
            UpdateButton,
            MenuItem
        },
        props: {
            gateway: Object
        },
        data() {
            return {
                tabs: {},
                devices: {},
                selectedIp: null,
                client: null,
                loading: false
            }
        },
        watch: {
            gateway() {
                this.devices = {}
                this.search();
            }
        },
        mounted() {
            this.search();
        },
        methods: {
            search() {
                this.loading = true;
                const foundDevices = []
                EventBus.on(REQUEST, ({id, loading}) => {
                    if (id == 'search') {
                        this.loading = loading;
                        if (!this.loading) {
                            Object.keys(this.devices).forEach((key) => {
                                if (!key in foundDevices) {
                                    delete this.devices[key]
                                    if (this.selectedIp == key) {
                                        this.selectedIp = undefined
                                    }
                                }
                            })
                        }
                    }
                })
                SearchApi.searchDevices((deviceInfo) => {
                    if (!this.devices[deviceInfo.ip]) {
                        this.devices[deviceInfo.ip] = deviceInfo
                        foundDevices.push(deviceInfo.ip)
                        console.debug(`Found new device: ${deviceInfo.name}`)
                    }
                }, this.gateway);
            },
            switchTab(ip) {
                if (!this.tabs[ip]) {
                    this.tabs[ip] = h(
                        DeviceControlPanel, { 
                            key: ip,
                            device: this.devices[ip],
                            gateway: this.gateway
                        }
                    );
                }
                this.selectedIp = ip;
            },
        },
    }
</script>

<template>
  <div class="devices-table">
    <div style="width: 400px;">
        <div style="position: relative;">
            <h1 class="title">Found devices</h1>
            <UpdateButton
                class="update"
                :loading="loading"
                :onClick="search"
            />
        </div>
        <div class="search-results">
            <MenuItem 
                v-for="[ip, deviceInfo] in Object.entries(devices)"
                :key="ip"
                :selected="selectedIp == ip"
                @click="switchTab(ip)"
            >
                <h1>{{ deviceInfo.name }} {{ deviceInfo.type ? "(" + deviceInfo.type + ")" : '' }}</h1>
                <h2>Ip <a :href="'http://' + ip" target=”_blank”>{{ ip }}</a></h2>
            </MenuItem>
        </div>
    </div>
    <div v-if="selectedIp">
        <h1 class="title">Control panel</h1>
        <KeepAlive>
            <component :is="tabs[selectedIp]"></component>
        </KeepAlive>
    </div>
  </div>
</template>

<style scoped>
    .update {
        position: absolute;
        right: 0px;
        top: 5px;
    }
    .devices-table {
        display: flex;
        flex-direction: row;
        gap: var(--default-gap);
    }
    .search-results {
        display: grid;
        row-gap: var(--default-gap);
        height: fit-content;
    }    
</style>
